# ADR-03 — Confirmação de consulta por SMS

- **Status:** aceito
- **Data:** 2026-09-02
- **Serviço decidido:** `expo-sms` para o MVP do desafio; gateway (Twilio ou
  Zenvia) registrado como próximo passo caso o app precise confirmar sem
  depender do paciente tocar em "enviar"
- **Relacionado:** [ADR-02-push-notificacoes.md](ADR-02-push-notificacoes.md),
  [00-mapeamento-dependencias-externas.md](00-mapeamento-dependencias-externas.md)

## Contexto

O desafio (Aula 13) pede confirmação de consulta por SMS. A API da clínica
não tem, e não deveria construir, acesso à rede de operadoras de celular —
enviar SMS de verdade exige um provedor com contrato junto às operadoras.

**Esta é a armadilha central deste ADR:** `expo-sms` e um gateway (Twilio,
Zenvia) não são duas opções do mesmo problema — são soluções para dois
problemas diferentes, e a squad precisa decidir qual dos dois problemas é
"confirmação de consulta".

## Opções consideradas

### Opção 1 — `expo-sms`

- **O que faz de fato:** abre o app nativo de SMS do aparelho com o número e
  o texto já preenchidos; **o próprio usuário toca em "enviar"**. O app não
  envia nada sozinho — só prepara a mensagem.
- **Exige chave?** Não.
- **Cota gratuita:** não aplicável — não há envio server-side, então não há
  cobrança por mensagem para a clínica.
- **Limites por segundo:** não aplicável (a limitação é a operadora do
  próprio usuário, fora do nosso controle).
- **Termos de uso:** exige verificar `SMS.isAvailableAsync()` antes de
  chamar — não funciona em simuladores/emuladores sem capacidade de SMS, nem
  em tablets/iPads sem chip.
- **App sem esse serviço amanhã:** `isAvailableAsync()` retorna `false`; a
  tela precisa oferecer alternativa (copiar número, ligar, WhatsApp) em vez
  de travar no botão de SMS.

### Opção 2 — Gateway (Twilio ou Zenvia)

- **O que faz de fato:** o **servidor** da clínica dispara o SMS
  diretamente pela API do provedor — nenhuma interação do paciente é
  necessária, a mensagem simplesmente chega.
- **Exige chave?** Sim — conta paga (ou trial), *Account SID* + *Auth
  Token* (Twilio) ou API key (Zenvia), mais um número de origem
  homologado.
- **Cota gratuita:** Twilio dá um crédito de avaliação (trial) limitado, e
  em modo trial só envia para números verificados manualmente na conta —
  não serve para produção sem upgrade. Zenvia funciona em modelo pré-pago
  por mensagem, sem crédito gratuito relevante para uso contínuo.
- **Limites por segundo:** taxas de envio por segundo definidas por
  *Messaging Service*/número de origem no provedor; em conta nova/trial o
  limite é baixo por padrão.
- **Termos de uso:** exige registro do caso de uso (no Brasil, mensagens
  transacionais têm regras próprias de cada operadora/provedor), proíbe
  envio para número sem consentimento (é *opt-in* obrigatório), e cobra por
  mensagem enviada além do trial.
- **App sem esse serviço amanhã (ou fora da cota/trial):** o envio falha no
  servidor — precisa de tratamento de erro explícito (não é um "app de SMS
  não disponível" como na Opção 1, é uma falha de API que pode incluir
  cobrança/limite estourado).

## Decisão

**Escolhido para o MVP do desafio: `expo-sms`.**

Critério que pesou mais: "confirmação de consulta" no escopo do desafio é o
*paciente* confirmando presença a partir do próprio app — nesse fluxo, é
aceitável (e mais simples) que o paciente veja a mensagem pronta e toque em
enviar, sem custo e sem depender de conta paga em provedor externo. Um
gateway é a escolha certa se, no futuro, o requisito virar "a clínica avisa
o paciente automaticamente sem ação dele" (mais parecido com o lembrete de
consulta do ADR-02 do que com uma confirmação ativa do paciente) — nesse
caso o registro correto é reabrir este ADR e trocar a decisão, não forçar o
`expo-sms` a fazer algo que ele não faz.

## Consequências

- **Fica mais fácil:** zero custo, zero conta externa, funciona já no
  desenvolvimento sem nenhuma credencial.
- **Fica mais arriscado:** a confirmação depende do paciente efetivamente
  tocar em "enviar" no app nativo — se ele fechar o app de mensagens sem
  enviar, a clínica não tem como saber que a confirmação não saiu (não há
  callback de sucesso, só a promessa de que o compositor abriu).
- **Se o serviço sair do ar:** não há "fora do ar" para `expo-sms` em si
  (é local ao aparelho), mas `isAvailableAsync()` pode retornar `false` em
  emulador/tablet sem chip — a tela precisa de um caminho alternativo
  (telefone, e-mail) nesse caso.

## Plano B

Quando `SMS.isAvailableAsync()` retornar `false`, ou o usuário voltar ao app
sem confirmar, a tela oferece um botão alternativo (ligar para a clínica ou
copiar o número/whats do consultório) — a confirmação de consulta nunca fica
bloqueada por dependência de um único canal. Se a squad migrar para gateway
no futuro, o Plano B passa a ser o próprio `expo-sms` como fallback do
gateway (inverso do estado atual).
