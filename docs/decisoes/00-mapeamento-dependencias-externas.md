# Mapeamento de dependências externas

> Aula 05 — antes de escrever código, a squad separou o que a API própria da
> clínica (`services/api.js`, hoje rodando em `192.168.15.80:3000`) consegue
> resolver sozinha do que depende de serviço de terceiro. Este documento é o
> registro desse levantamento. As decisões detalhadas (opções, critério,
> consequências, plano B) de cada serviço abaixo estão nos ADRs individuais
> em `docs/decisoes/ADR-*.md` — este arquivo é só o mapa, não repete o
> raciocínio completo de cada um.

## Por que a API própria não resolve isso

A API da clínica é um CRUD de agendamento (médicos, pacientes, consultas).
Ela não é, e não deveria virar, um serviço de mapas, de push, de SMS ou de
geocoding — nenhuma dessas coisas é dado de negócio da clínica, são
capacidades de infraestrutura que exigem coisas que a squad não tem (base de
CEP nacional atualizada, rede de operadoras de celular, servidores de push
homologados nas lojas, tiles de mapa do mundo inteiro). Tentar reimplementar
qualquer uma delas dentro do `services/api.js` seria reinventar um serviço
que já existe, mantido por quem tem escala para isso.

## Tabela-resumo

| # | Funcionalidade | Por que a API da clínica não resolve | Serviço escolhido | ADR |
|---|---|---|---|---|
| 1 | Mapa da localização da clínica / rotas | Não temos tiles de mapa nem dados geográficos; é infraestrutura de mapas, não dado de agendamento | Google Maps via `react-native-maps` (Android) | [ADR-01-mapas.md](ADR-01-mapas.md) |
| 2 | Notificação push de lembrete de consulta | Não temos servidor homologado junto à Apple/Google para entregar push em background | Expo Push Notification Service | [ADR-02-push-notificacoes.md](ADR-02-push-notificacoes.md) |
| 3 | Confirmação de consulta por SMS | Não temos acesso à rede de operadoras de celular para enviar SMS | `expo-sms` (MVP) com plano de migração para gateway (Twilio/Zenvia) | [ADR-03-sms.md](ADR-03-sms.md) |
| 4 | Preenchimento automático de endereço a partir do CEP | Não temos base de CEPs dos Correios; manter essa base atualizada não é o problema que a clínica resolve | ViaCEP | [ADR-04-cep.md](ADR-04-cep.md) |
| 5 | Coordenadas do endereço da clínica (geocoding) | Não temos motor de geocoding nem base geográfica | Nominatim (OpenStreetMap) | [ADR-05-geocoding.md](ADR-05-geocoding.md) |

## O que muda se o serviço sair do ar amanhã (resumo — detalhe no ADR de cada um)

- **Mapa fora do ar / sem chave configurada:** app perde a visualização de
  mapa, mas o endereço em texto (rua, cidade, UF) continua disponível — não
  bloqueia agendamento.
- **Push fora do ar:** paciente não recebe lembrete automático; consulta
  continua marcada normalmente no banco, só o aviso proativo que falha. Vira
  candidato a e-mail ou notificação in-app como reforço.
- **SMS fora do ar (ou usuário sem app de mensagens configurado):**
  confirmação de consulta precisa de canal alternativo (telefone, e-mail,
  WhatsApp manual) — não pode ser o único canal de confirmação.
- **ViaCEP fora do ar:** campo de CEP some do fluxo automático, mas o
  formulário de paciente continua aceitando endereço digitado à mão. Cadastro
  nunca fica bloqueado por causa do CEP.
- **Nominatim fora do ar:** tela "Sobre a clínica" mostra o endereço em texto
  sem coordenadas/mapa; como o endereço da clínica é fixo, o resultado já
  seria cacheado localmente na maior parte do tempo.

## As três armadilhas (conferidas antes da véspera das aulas 9, 12 e 13)

1. **Push (Aula 9):** o Expo Push Service não funciona no Expo Go no Android
   desde o SDK 53 — a Expo removeu o suporte a `expo-notifications` remoto no
   Expo Go Android justamente porque o comportamento enganava times (parecia
   funcionar no Expo Go e quebrava no build de verdade). É preciso
   development build (`eas build --profile development`) para testar push
   remoto no Android. iOS ainda funciona no Expo Go. Isso muda o
   planejamento da squad: alguém precisa gerar o development build antes da
   Aula 9, não durante.
2. **Mapas (Aula 12):** `react-native-maps` com provider Google no Android
   exige API key, e a API key exige projeto no Google Cloud Console **com
   faturamento habilitado** (cartão de crédito cadastrado), mesmo que o uso
   fique inteiro dentro da cota gratuita mensal. Sem isso o mapa carrega em
   branco (só logo do Google e marcadores, sem o mapa de fundo). A squad
   precisa decidir quem cadastra o cartão — ou considerar Mapbox/OSM como
   alternativa sem cartão — bem antes de 22/10.
3. **SMS (Aula 13):** `expo-sms` **não envia** SMS — ele abre o app nativo de
   mensagens do aparelho já com o texto preenchido, e é o usuário quem toca
   em "enviar". Um gateway (Twilio, Zenvia) envia pelo servidor, sem
   nenhuma interação do usuário, mas custa por mensagem e exige conta/API
   key. Para "confirmação de consulta" — onde queremos que a mensagem saia
   sozinha quando o sistema confirma o agendamento, sem depender do paciente
   tocar em nada — só o gateway resolve o problema de verdade; `expo-sms` só
   serve como atalho para o paciente *enviar* uma mensagem para a clínica
   (ex.: "confirmar por SMS" a partir do próprio app do paciente), não para a
   clínica confirmar automaticamente. Ver [ADR-03-sms.md](ADR-03-sms.md) para
   o critério completo.
