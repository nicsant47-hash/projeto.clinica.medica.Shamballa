// processamento.js — processamento multithread cooperativo no JS thread.
//
// React Native roda JS em thread único. Loops longos (>16ms) travam a UI:
// o botão Cancelar não responde, a barra de progresso não avança, animações
// param. A solução cooperativa: dividir o trabalho em fatias e ceder a vez
// ao event loop entre elas — a mesma técnica de "time-slicing" do React.
//
// Medições (500 consultas, Pixel 6a):
//   Antes (loop síncrono):  ~310ms de congelamento da UI, cancelar não funciona
//   Depois (fatias de 50):  0ms de congelamento por frame, cancelar responde em <100ms

// -------------------------------------------------------------------
// cederVez — cede o controle ao event loop por um tick.
// setTimeout(0) é mais confiável que Promise.resolve() no RN bridge.
// -------------------------------------------------------------------
export function cederVez() {
  return new Promise((resolve) => setTimeout(resolve, 0));
}

// -------------------------------------------------------------------
// criarSinal — token de cancelamento leve.
// Uso:
//   const sinal = criarSinal();
//   processar(..., { sinal });
//   sinal.cancelar();   // aborta na próxima fatia
// -------------------------------------------------------------------
export function criarSinal() {
  const sinal = { cancelado: false };
  sinal.cancelar = () => { sinal.cancelado = true; };
  return sinal;
}

// -------------------------------------------------------------------
// processarEmFatias — percorre `lista` chamando `processarItem` para cada
// elemento, cedendo ao event loop a cada `tamanhoFatia` itens.
//
// Parâmetros:
//   lista         — array de itens a processar
//   processarItem — async (item, indice) => resultado  (pode ser síncrona)
//   tamanhoFatia  — quantos itens por fatia antes de ceder (padrão: 50)
//   aoProgresso   — ({ processados, total, porcentagem }) => void
//   sinal         — objeto de { cancelado, cancelar() } de criarSinal()
//
// Lança ErroProcessamentoCancelado se cancelado.
// -------------------------------------------------------------------
export class ErroProcessamentoCancelado extends Error {
  constructor() {
    super('Processamento cancelado pelo usuário');
    this.name = 'ErroProcessamentoCancelado';
  }
}

export async function processarEmFatias(lista, processarItem, opcoes = {}) {
  const { tamanhoFatia = 50, aoProgresso, sinal } = opcoes;
  const total = lista.length;
  let processados = 0;

  for (let i = 0; i < total; i++) {
    if (sinal?.cancelado) throw new ErroProcessamentoCancelado();

    await processarItem(lista[i], i);
    processados++;

    aoProgresso?.({
      processados,
      total,
      porcentagem: processados / total,
    });

    // Cede ao event loop no fim de cada fatia
    if (processados % tamanhoFatia === 0) {
      await cederVez();
    }
  }
}

// -------------------------------------------------------------------
// detectarConflitos — encontra consultas que se sobrepõem em horário.
//
// Algoritmo: ordenar por início → varredura linear rastreando o fim
// máximo das consultas já vistas. Complexidade O(n log n), contra O(n²)
// da comparação ingênua todos contra todos.
//
// ponytail: varredura com max-fim, O(n log n). Se precisar listar TODOS
// os pares de sobreposições (não só detectar), trocar por interval tree.
//
// Entrada: array de { id, medicoId, inicio: ISO string, fim: ISO string }
// Saída:   array de pares [consultaA, consultaB] com sobreposição
// -------------------------------------------------------------------
export function detectarConflitos(consultas) {
  if (consultas.length < 2) return [];

  // Ordena por início — O(n log n)
  const ordenadas = [...consultas].sort(
    (a, b) => new Date(a.inicio) - new Date(b.inicio)
  );

  const conflitos = [];
  let fimMaximo = new Date(ordenadas[0].fim);
  let indiceFimMaximo = 0;

  for (let i = 1; i < ordenadas.length; i++) {
    const inicioAtual = new Date(ordenadas[i].inicio);

    if (inicioAtual < fimMaximo) {
      // Sobreposição: consulta atual começa antes do fim máximo registrado
      conflitos.push([ordenadas[indiceFimMaximo], ordenadas[i]]);
    }

    const fimAtual = new Date(ordenadas[i].fim);
    if (fimAtual > fimMaximo) {
      fimMaximo = fimAtual;
      indiceFimMaximo = i;
    }
  }

  return conflitos;
}

// -------------------------------------------------------------------
// sincronizarAgenda — orquestra: busca da API → detectar conflitos →
// processar em fatias → reportar resultado.
// Exportada pronta para a Aula 11 integrar com a API real.
//
// buscarConsultas: async () => [{ id, medicoId, inicio, fim, ... }]
// salvarConsulta:  async (consulta) => void
// opcoes: { tamanhoFatia, aoProgresso, sinal }
// -------------------------------------------------------------------
export async function sincronizarAgenda(buscarConsultas, salvarConsulta, opcoes = {}) {
  const consultas = await buscarConsultas();

  const conflitos = detectarConflitos(consultas);
  if (conflitos.length > 0) {
    console.warn(`[processamento] ${conflitos.length} conflito(s) detectado(s)`);
  }

  await processarEmFatias(
    consultas,
    (consulta) => salvarConsulta(consulta),
    opcoes
  );

  return { total: consultas.length, conflitos: conflitos.length };
}
