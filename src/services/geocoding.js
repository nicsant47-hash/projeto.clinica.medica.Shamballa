import { buscarExterno, ServicoExternoIndisponivel } from "./httpExterno";

const NOME_SERVICO = "Nominatim";
const BASE_URL = "https://nominatim.openstreetmap.org/search";

// Política de uso do Nominatim exige identificar a aplicação com um
// User-Agent descritivo — o header genérico já é enviado por
// buscarExterno, aqui só reforçamos o contato para ficar visível no log
// do provedor caso ele precise falar com a gente.
const USER_AGENT_NOMINATIM =
  "ClinicaShamballaApp/1.0 (uso educacional; contato@clinicashamballa.com.br)";

// A política do Nominatim também exige cachear o resultado: geocodificar o
// mesmo endereço repetidamente é uso indevido. Como o endereço da clínica
// não muda durante a execução do app, um cache em memória (por chave de
// endereço) é suficiente — não precisa persistir em disco.
const cache = new Map();

function chaveDoEndereco({ logradouro, cidade, uf }) {
  return `${logradouro}|${cidade}|${uf}`.toLowerCase();
}

// geocodificar({ logradouro, cidade, uf }) -> Promise<{ latitude, longitude, enderecoEncontrado }>
export async function geocodificar({ logradouro, cidade, uf }) {
  const chave = chaveDoEndereco({ logradouro, cidade, uf });

  if (cache.has(chave)) {
    return cache.get(chave);
  }

  const enderecoBusca = `${logradouro}, ${cidade}, ${uf}, Brasil`;
  const url = `${BASE_URL}?format=json&limit=1&q=${encodeURIComponent(enderecoBusca)}`;

  let resposta;
  try {
    resposta = await buscarExterno(NOME_SERVICO, url, {
      headers: { "User-Agent": USER_AGENT_NOMINATIM },
    });
  } catch (erro) {
    if (erro instanceof ServicoExternoIndisponivel && erro.status === 403) {
      throw new ServicoExternoIndisponivel(
        NOME_SERVICO,
        `${NOME_SERVICO}: acesso negado (403). O Nominatim recusa User-Agent genérico ou bloqueou uso acima da política — confira o header enviado e o ritmo das chamadas.`,
        403
      );
    }
    throw erro;
  }

  const dados = await resposta.json();

  if (!Array.isArray(dados) || dados.length === 0) {
    throw new ServicoExternoIndisponivel(
      NOME_SERVICO,
      `${NOME_SERVICO}: nenhum resultado encontrado para esse endereço.`
    );
  }

  const resultado = {
    latitude: parseFloat(dados[0].lat),
    longitude: parseFloat(dados[0].lon),
    enderecoEncontrado: dados[0].display_name,
  };

  cache.set(chave, resultado);
  return resultado;
}
