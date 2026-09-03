# ADR-05 — Geocoding do endereço da clínica

- **Status:** aceito e implementado
- **Data:** 2026-09-02
- **Serviço decidido:** Nominatim (OpenStreetMap)
- **Implementação:** [src/services/geocoding.js](../../src/services/geocoding.js),
  usado em `SobreClinicaScreen`
- **Relacionado:** [ADR-01-mapas.md](ADR-01-mapas.md) (consome o resultado deste
  ADR quando o mapa da Aula 12 for implementado), [00-mapeamento-dependencias-externas.md](00-mapeamento-dependencias-externas.md)

## Contexto

A tela "Sobre a clínica" precisa mostrar a localização da clínica, e na
Aula 12 isso vira um mapa de verdade. Para isso é preciso transformar o
endereço em texto (rua, cidade, UF) em coordenadas (latitude/longitude) — a
API da clínica guarda o endereço como texto porque é assim que ele é
cadastrado por uma pessoa; ela não tem, e não deveria ter, um motor de
geocoding embutido.

## Opções consideradas

### Opção 1 — Nominatim (OpenStreetMap)

- **Exige chave?** Não exige API key, mas **exige** um `User-Agent` (ou
  `Referer`) HTTP identificando a aplicação — user agents padrão de
  biblioteca HTTP são rejeitados.
- **Cota gratuita:** o serviço público (`nominatim.openstreetmap.org`) é
  gratuito, mantido pela OpenStreetMap Foundation.
- **Limites por segundo:** **1 requisição por segundo**, no máximo absoluto;
  para uso recorrente/agendado o limite prático é 4 requisições por minuto,
  em thread única (nada de chamadas paralelas/`Promise.all`). Estourar o
  limite gera resposta `429` como aviso antes de bloqueio mais longo.
- **Termos de uso:** exige **atribuição visível** ("© OpenStreetMap
  contributors") em qualquer tela que exiba o resultado, e exige **cachear o
  resultado no nosso lado** — não é permitido geocodificar o mesmo endereço
  repetidamente.
- **App sem esse serviço amanhã:** a tela perde a possibilidade de
  geocodificar um endereço novo, mas como o endereço da clínica é fixo e
  fica cacheado após a primeira consulta, a tela "Sobre a clínica" continua
  mostrando as coordenadas já obtidas anteriormente.

### Opção 2 — Google Geocoding API

- **Exige chave?** Sim — mesma chave/projeto do Google Cloud do ADR-01, com
  faturamento habilitado.
- **Cota gratuita:** crédito mensal recorrente na conta de faturamento
  cobre um volume generoso de chamadas de geocoding para o nosso uso.
- **Limites por segundo:** cota configurável por projeto no console, tipicamente
  bem acima de 1 req/s — não é o gargalo.
- **Termos de uso:** proíbe usar coordenadas obtidas via Google para
  alimentar mapa de outro provedor (ex.: geocodificar no Google e plotar no
  Mapbox/Leaflet viola os termos).
- **App sem esse serviço amanhã:** mesma degradação — sem chave/faturamento
  válido, a chamada falha e a tela cai para o texto do endereço.

## Decisão

**Escolhido: Nominatim (OpenStreetMap).**

Critério que pesou mais: não exige cartão de crédito nem conta Google
adicional — o app já vai precisar lidar com a exigência de faturamento do
Google no ADR-01 (mapa), então não faz sentido criar a mesma dependência
duas vezes para uma tela que só precisa geocodificar **um** endereço fixo
(o da própria clínica), não um volume de endereços de usuários. O limite de
1 req/s do Nominatim não é um problema real para esse volume de uso.

## Consequências

- **Fica mais fácil:** zero custo, zero conta/cartão adicional, endereço da
  clínica é geocodificado uma única vez.
- **Fica mais arriscado:** violar o limite de 1 req/s (por exemplo, se
  alguém no futuro usar esta mesma função para geocodificar endereços de
  pacientes em lote) gera bloqueio temporário do IP — por isso o código
  (`src/services/geocoding.js`) já nasce cacheando o resultado e documentando
  que chamadas múltiplas precisam ser espaçadas em pelo menos 1s, sem
  `Promise.all`.
- **Se o serviço sair do ar:** a tela "Sobre a clínica" mostra o endereço em
  texto sem coordenadas na primeira vez; se já havia cache de uma consulta
  anterior, as coordenadas cacheadas continuam sendo exibidas normalmente.

## Plano B

O resultado da geocodificação é armazenado (cache em memória do módulo,
já que o endereço da clínica não muda durante a execução do app) assim que
a primeira consulta é bem-sucedida. Se o Nominatim estiver indisponível na
primeira consulta, a tela mostra o endereço em texto com um aviso não
bloqueante ("coordenadas indisponíveis no momento") em vez de erro fatal, e
tenta novamente na próxima abertura da tela.
