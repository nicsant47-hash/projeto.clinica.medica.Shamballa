# ADR-04 — Preenchimento automático de endereço a partir do CEP

- **Status:** aceito e implementado
- **Data:** 2026-09-02
- **Serviço decidido:** ViaCEP
- **Implementação:** [src/services/viacep.js](../../src/services/viacep.js),
  usado em [src/screens/CadastroPacienteScreen.js](../../src/screens/CadastroPacienteScreen.js)
- **Relacionado:** [00-mapeamento-dependencias-externas.md](00-mapeamento-dependencias-externas.md)

## Contexto

O cadastro de paciente pede endereço completo. Digitar rua, bairro, cidade e
UF à mão é lento e sujeito a erro de digitação. A API da clínica não tem, e
não deveria manter, uma base nacional de CEPs dos Correios — manter essa
base atualizada (ruas novas, mudanças de bairro) é um problema de dados
públicos que já é resolvido por serviços dedicados a isso.

## Opções consideradas

### Opção 1 — ViaCEP

- **Exige chave?** Não. Sem cadastro, sem token, sem autenticação.
- **Cota gratuita:** ilimitada no sentido formal (não há plano pago nem
  limite numérico publicado), mas o próprio serviço avisa que **bloqueia por
  tempo indeterminado** IPs que ele identifica fazendo uso massivo/de
  script — o limite existe, só não é um número fixo documentado.
- **Limites por segundo:** não documentado numericamente; a orientação
  prática é não disparar uma consulta por tecla digitada (é exatamente o que
  o Passo 4 pede para evitar: disparar no `onBlur`, não no `onChangeText`).
- **Termos de uso:** uso comercial é permitido dentro do uso razoável;
  retorna JSON, XML ou JSONP à escolha (usamos JSON).
- **App sem esse serviço amanhã:** o campo de CEP simplesmente não preenche
  nada sozinho — o formulário continua 100% preenchível à mão, os campos de
  endereço nunca ficam bloqueados.

### Opção 2 — BrasilAPI (`/api/cep/v2/{cep}`)

- **Exige chave?** Não. Também gratuita e sem autenticação.
- **Cota gratuita:** sem limite publicado; projeto open source mantido pela
  comunidade, hospedado em infraestrutura serverless.
- **Limites por segundo:** também sem número fixo documentado; sujeita à
  mesma orientação de uso razoável.
- **Termos de uso:** projeto aberto (código no GitHub), sem contrato formal
  de nível de serviço (SLA) — é mantido por voluntários, então
  disponibilidade não tem garantia contratual.
- **App sem esse serviço amanhã:** mesma degradação da Opção 1.

## Decisão

**Escolhido: ViaCEP.**

Critério que pesou mais: é o serviço de referência usado no gabarito da
disciplina e no mercado brasileiro em geral (mais tempo em produção, mais
exemplos e troubleshooting disponíveis), e o formato de resposta
(`logradouro`, `bairro`, `localidade`, `uf`) é direto de mapear para os
campos do formulário. BrasilAPI fica registrada como alternativa/fallback
caso o ViaCEP apresente instabilidade recorrente.

## Consequências

- **Fica mais fácil:** cadastro de paciente mais rápido e com endereço mais
  consistente (menos erro de digitação em cidade/UF).
- **Fica mais arriscado:** dependência de disponibilidade de terceiro no
  fluxo de cadastro — por isso o cadastro **nunca** pode ficar bloqueado
  esperando o ViaCEP responder (ver Plano B).
- **Se o serviço sair do ar:** a consulta falha (timeout ou erro de rede),
  a tela mostra um aviso não-bloqueante, e os campos de endereço continuam
  editáveis manualmente. O cadastro em si não depende do ViaCEP para
  existir.

## Plano B

Enquanto o ViaCEP estiver indisponível (erro de rede, timeout, ou `429`), o
formulário mantém os campos de logradouro/bairro/cidade/UF **habilitados e
vazios**, com um aviso curto abaixo do campo de CEP ("não foi possível
buscar o endereço automaticamente — preencha manualmente"). Nenhum erro
fatal é mostrado, e o botão de cadastrar continua funcionando normalmente.
