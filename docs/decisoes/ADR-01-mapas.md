# ADR-01 — Mapa da clínica e roteamento

- **Status:** aceito
- **Data:** 2026-09-02
- **Serviço decidido:** Google Maps, via `react-native-maps`
- **Relacionado:** [ADR-05-geocoding.md](ADR-05-geocoding.md) (o mapa consome as
  coordenadas que o geocoding produz), [00-mapeamento-dependencias-externas.md](00-mapeamento-dependencias-externas.md)

## Contexto

O desafio pede uma tela com o mapa da clínica (Aula 12) e, depois, rotas até
o local. A API própria da clínica guarda o endereço em texto (rua, número,
bairro, cidade, UF) — ela não tem, e não deveria ter, tiles de mapa, cálculo
de rota ou renderização geográfica. Isso é infraestrutura de mapas, um
problema já resolvido por quem opera mapas em escala mundial; não é dado de
agendamento.

## Opções consideradas

### Opção 1 — Google Maps (`react-native-maps`, provider Google)

- **Exige chave?** Sim. Uma chave de API por plataforma (Android e iOS),
  criada no Google Cloud Console, vinculada a um projeto **com faturamento
  habilitado** — isto é obrigatório mesmo que o uso nunca ultrapasse a cota
  gratuita.
- **Cota gratuita:** Google concede crédito mensal recorrente na conta de
  faturamento; dentro dele o uso não é cobrado, mas o cartão de crédito
  cadastrado é pré-condição para a chave existir.
- **Limites por segundo:** por padrão a cota é medida em requisições por
  minuto/dia por projeto, configurável no console; não é o gargalo real para
  o nosso volume de uso.
- **Termos de uso:** proíbe cachear tiles do mapa por longos períodos fora do
  SDK, exige exibir a marca Google no mapa, e a chave pode ser restrita por
  pacote/assinatura do app (recomendado).
- **App sem esse serviço amanhã:** sem chave válida (ou faturamento
  suspenso), o `MapView` do Android renderiza em branco — aparecem só
  marcadores e o logo do Google, sem o mapa de fundo. No iOS, sem provider
  Google, cai no Apple Maps nativo (que não exige chave).

### Opção 2 — Mapbox (`@rnmapbox/maps`)

- **Exige chave?** Sim, um *access token* do Mapbox, sem exigir cartão de
  crédito para o tier gratuito.
- **Cota gratuita:** faixa gratuita mensal de carregamentos de mapa (na
  ordem de dezenas de milhares/mês), suficiente para uso de estudo/MVP.
- **Limites por segundo:** não há limite agressivo por segundo documentado
  para uso normal de app mobile; o controle é por carregamentos/mês.
- **Termos de uso:** exige atribuição visível ("© Mapbox © OpenStreetMap") e
  proíbe uso que contorne a cobrança (ex.: cachear tiles para servir a
  terceiros).
- **App sem esse serviço amanhã:** mapa não carrega; mesma degradação da
  Opção 1 — o app precisa continuar funcional com o endereço em texto.

## Decisão

**Escolhido: Google Maps via `react-native-maps`.**

Critério que pesou mais: `react-native-maps` é a lib padrão do ecossistema
Expo/React Native para o que o desafio pede na Aula 12 (documentação e
exemplos do próprio curso usam Google Maps), e a squad já vai precisar de uma
conta Google para outros fins do projeto. O custo do faturamento habilitado é
aceito porque o uso fica muito abaixo da cota gratuita — o risco não é
financeiro, é operacional (ver Consequências).

Mapbox fica registrado como alternativa válida caso o cadastro de cartão de
crédito da conta Google vire bloqueio real da squad antes da Aula 12.

## Consequências

- **Fica mais fácil:** integração direta com o restante do ecossistema Expo,
  documentação abundante em português e inglês, mesma lib usada em aula.
- **Fica mais arriscado:** a squad depende de uma pessoa (ou conta) que
  cadastre um cartão de crédito real no Google Cloud — se essa pessoa sair
  da squad ou o cartão expirar, o mapa quebra silenciosamente (não dá erro
  óbvio, o mapa só fica em branco). Isso precisa virar um item de
  checklist antes da Aula 12, não descoberto em 22/10 como o enunciado
  avisa.
- **Se o serviço sair do ar (ou a chave for revogada):** o `MapView`
  renderiza em branco no Android. O app não trava — o endereço em texto
  (vindo da própria API da clínica) continua visível na tela "Sobre a
  clínica" independentemente do mapa carregar ou não.

## Plano B

Enquanto não há chave configurada (é o estado atual do projeto, antes da
Aula 12), a tela de endereço mostra rua/bairro/cidade/UF e as coordenadas
numéricas (lat/long) obtidas via geocoding (ADR-05), sem o componente de
mapa. Quando a chave existir, o mesmo dado alimenta o `MapView` sem mudar a
fonte de verdade do endereço.
