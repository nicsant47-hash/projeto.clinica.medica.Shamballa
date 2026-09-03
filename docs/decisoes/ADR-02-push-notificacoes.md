# ADR-02 — Notificação push de lembrete de consulta

- **Status:** aceito
- **Data:** 2026-09-02
- **Serviço decidido:** Expo Push Notification Service (`expo-notifications` + `expo-server-sdk`)
- **Relacionado:** [ADR-03-sms.md](ADR-03-sms.md) (canal alternativo de aviso),
  [00-mapeamento-dependencias-externas.md](00-mapeamento-dependencias-externas.md)

## Contexto

O desafio (Aula 9) pede lembrete de consulta por push. A API da clínica sabe
*quando* avisar (tem a data/hora da consulta no banco), mas não tem, e não
deveria construir do zero, um servidor homologado junto à Apple (APNs) e ao
Google (FCM) para entregar notificação em background nos dois sistemas
operacionais — isso é um protocolo de infraestrutura mobile, não lógica de
agendamento.

## Opções consideradas

### Opção 1 — Expo Push Notification Service

- **Exige chave?** Não exige chave de API tradicional para enviar; usa o
  *Expo Push Token* gerado no dispositivo (via `expo-notifications`) como
  identificador do destinatário. Para volumes altos existe um *access token*
  opcional (Expo Access Token) para autenticar a origem dos envios.
- **Cota gratuita:** gratuito, sem cobrança por notificação enviada.
- **Limites por segundo:** o serviço aceita envios em lote (até 100
  mensagens por requisição) e recomenda não disparar rajadas muito acima
  disso sem usar o SDK oficial, que já faz o chunking.
- **Termos de uso:** o token expira/some se o app for desinstalado; é preciso
  tratar o *receipt* de erro (`DeviceNotRegistered`) e parar de enviar para
  aquele token.
- **App sem esse serviço amanhã:** nenhum push é entregue; a consulta
  continua marcada normalmente no banco da clínica — só o aviso proativo
  falha silenciosamente do ponto de vista do paciente.

### Opção 2 — Firebase Cloud Messaging (FCM) direto

- **Exige chave?** Sim — projeto Firebase, `google-services.json`
  (Android) / `GoogleService-Info.plist` (iOS), e uma *service account key*
  no backend para enviar.
- **Cota gratuita:** gratuito para envio de notificações (FCM não cobra por
  mensagem).
- **Limites por segundo:** limites generosos por projeto, mas a
  configuração de credenciais é inteira responsabilidade da squad (sem o
  atalho que a Expo dá).
- **Termos de uso:** exige aceitar os termos do Firebase/Google, e a
  integração nativa (fora do fluxo gerenciado da Expo) exige mais código de
  configuração (build.gradle, plist) do que o SDK da Expo.
- **App sem esse serviço amanhã:** mesma degradação — sem push, sem quebrar
  o agendamento em si.

## Decisão

**Escolhido: Expo Push Notification Service.**

Critério que pesou mais: o projeto já está no fluxo gerenciado da Expo
(`expo` no `package.json`, sem `ios/`/`android/` nativos ainda) — usar FCM
direto exigiria "ejetar" parte da configuração nativa antes da hora. O Expo
Push Service abstrai APNs e FCM atrás de uma única API HTTP simples e é
gratuito, o que resolve o problema sem custo e sem sair do fluxo gerenciado.

## Consequências

- **Fica mais fácil:** um único endpoint (`https://exp.host/--/api/v2/push/send`)
  entrega tanto em iOS quanto Android, sem lidar com certificados APNs
  manualmente.
- **Fica mais arriscado (armadilha da Aula 9):** desde o SDK 53 do Expo, o
  `expo-notifications` **não funciona no Expo Go no Android** — é preciso
  gerar um *development build* (`eas build --profile development` ou
  `npx expo run:android`) para testar push remoto de verdade nesse SO. No
  iOS o Expo Go ainda funciona. Isso muda o planejamento: alguém da squad
  precisa gerar o development build **antes** da Aula 9, não na véspera —
  gerar build tem fila e pode levar mais tempo do que parece.
- **Se o serviço sair do ar:** o paciente não recebe o lembrete automático.
  Como a consulta já está confirmada no banco da própria clínica, nada é
  perdido em termos de dado — só o canal proativo de aviso falha.

## Plano B

Enquanto o development build não existe (estado atual do projeto), a squad
usa **notificação local** (`expo-notifications` em modo local, que funciona
no Expo Go) para simular o lembrete durante o desenvolvimento, e trata o
envio remoto como feature que só é testável a partir do development build.
Se o Expo Push Service ficar fora do ar em produção, o lembrete de consulta
cai para o canal secundário já usado no fluxo de confirmação (SMS/e-mail —
ver [ADR-03-sms.md](ADR-03-sms.md)), evitando depender de um único canal.
