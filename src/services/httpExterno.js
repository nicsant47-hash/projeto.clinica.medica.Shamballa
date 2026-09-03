// Cliente HTTP para serviços de TERCEIROS (ViaCEP, Nominatim, etc).
//
// É primo do services/api.js, mas não é o mesmo arquivo: api.js fala com a
// nossa própria API e pode enviar o token de autenticação da clínica.
// Este arquivo fala com servidores de fora — enviar o token da clínica aqui
// seria vazar credencial para um terceiro, por isso NUNCA anexe
// Authorization/token do app nas chamadas feitas com buscarExterno.

const TIMEOUT_PADRAO_MS = 8000;
const USER_AGENT = "ClinicaShamballaApp/1.0 (contato@clinicashamballa.com.br)";

export class ServicoExternoIndisponivel extends Error {
  constructor(servico, mensagem, status) {
    super(mensagem);
    this.name = "ServicoExternoIndisponivel";
    this.servico = servico;
    this.status = status;
  }
}

// buscarExterno(nomeServico, url, opcoes) -> Promise<Response>
// opcoes aceita tudo que fetch aceita, mais timeoutMs (default 8s).
export async function buscarExterno(nomeServico, url, opcoes = {}) {
  const { timeoutMs = TIMEOUT_PADRAO_MS, headers = {}, ...resto } = opcoes;

  const controlador = new AbortController();
  const timer = setTimeout(() => controlador.abort(), timeoutMs);

  try {
    const resposta = await fetch(url, {
      ...resto,
      headers: {
        "User-Agent": USER_AGENT,
        ...headers,
      },
      signal: controlador.signal,
    });

    if (resposta.status === 429) {
      throw new ServicoExternoIndisponivel(
        nomeServico,
        `${nomeServico}: limite de requisições atingido (HTTP 429). Aguarde antes de tentar de novo — insistir agora costuma render bloqueio maior.`,
        429
      );
    }

    if (!resposta.ok) {
      throw new ServicoExternoIndisponivel(
        nomeServico,
        `${nomeServico}: erro HTTP ${resposta.status} ao consultar o serviço externo.`,
        resposta.status
      );
    }

    return resposta;
  } catch (erro) {
    if (erro instanceof ServicoExternoIndisponivel) {
      throw erro;
    }

    if (erro.name === "AbortError") {
      throw new ServicoExternoIndisponivel(
        nomeServico,
        `${nomeServico}: tempo esgotado ao tentar se conectar. Tente novamente em instantes.`
      );
    }

    throw new ServicoExternoIndisponivel(
      nomeServico,
      `${nomeServico}: não foi possível se conectar (${erro.message}).`
    );
  } finally {
    clearTimeout(timer);
  }
}
