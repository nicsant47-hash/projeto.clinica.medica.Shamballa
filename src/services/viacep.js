import { buscarExterno, ServicoExternoIndisponivel } from "./httpExterno";

const NOME_SERVICO = "ViaCEP";

// consultarCep(cep) -> Promise<Endereco | null>
// null = CEP bem formado mas que não existe na base dos Correios
// (é o caso `{ erro: "true" }` do ViaCEP) — não é uma falha de serviço,
// então NÃO lança erro, só devolve null para o formulário tratar como
// "não encontrado" e deixar os campos livres para preenchimento manual.
export async function consultarCep(cep) {
  const cepLimpo = (cep || "").replace(/\D/g, "");

  if (cepLimpo.length !== 8) {
    throw new Error("CEP deve ter 8 dígitos.");
  }

  const resposta = await buscarExterno(
    NOME_SERVICO,
    `https://viacep.com.br/ws/${cepLimpo}/json/`
  );

  let dados;
  try {
    dados = await resposta.json();
  } catch (erroDeParse) {
    throw new ServicoExternoIndisponivel(
      NOME_SERVICO,
      `${NOME_SERVICO}: resposta inesperada do servidor (não é JSON).`
    );
  }

  if (dados.erro) {
    return null;
  }

  // Traduz para o vocabulário do nosso formulário.
  return {
    cep: dados.cep,
    logradouro: dados.logradouro,
    bairro: dados.bairro,
    cidade: dados.localidade,
    uf: dados.uf,
  };
}
