# TODO — CRUD de Pacientes (Passo 3 + Passo 7 da Aula 3)

Branch sugerida: `feature/api-pacientes`, a partir do `master` (depois que
`feature/api-medicos` for mergeada).

O padrão a seguir é exatamente o que foi aplicado em Médico nesta rodada:
`BASE_URL` + fetch dentro do próprio componente, estados
`carregando`/`erro`/dados, `useFocusEffect` para recarregar ao voltar de
telas, e POST/PUT/DELETE com `resposta.ok` verificado antes de seguir.

Use como referência direta:
- [src/screens/Medico/Medico.js](src/screens/Medico/Medico.js) — listagem com GET, estados de tela, DELETE com confirmação.
- [src/screens/Medico/CadastroEdicaoMedicoScreen.js](src/screens/Medico/CadastroEdicaoMedicoScreen.js) — POST vs PUT.
- [src/components/MedicoForm.js](src/components/MedicoForm.js) — formulário com validação, estado `salvando`, `handleSubmit` assíncrono.
- [src/config.js](src/config.js) — `BASE_URL` compartilhada, já pronta, não precisa recriar.
- `db_clinica.json` já tem `"pacientes": []` pronto — não precisa mexer nesse arquivo.

O mock já roda com `npm run mock-api` (json-server na porta 3000, servindo
`db_clinica.json` na raiz de `app-base/`). Endpoint: `/pacientes`.

---

## Passo 3 — Listagem de pacientes via GET (leitura)

- [x] Reescrever [src/screens/Paciente/Paciente.js](src/screens/Paciente/Paciente.js) (hoje é só um texto placeholder).
- [x] Importar `BASE_URL` de `../../config`.
- [x] Estados: `pacientes`, `carregando`, `erro` (mesmo padrão do `Medico.js`).
- [x] Função `buscarPacientes()` assíncrona: `fetch`, checar `resposta.ok`, `.json()`, `try/catch/finally`.
- [x] Chamar com `useFocusEffect` (não `useEffect` simples), igual foi feito em `Medico.js`.
- [x] Renderizar os três estados: `ActivityIndicator` (carregando), mensagem de erro + botão "Tentar novamente" (erro), `FlatList` simples (sucesso) — não precisa de `SectionList`/agrupamento por letra, isso é só em Médico.
- [x] Em [App.js](App.js): descomentar o import de `Paciente` (trocar `Op2Screen` pelo nome real exportado, que deve ser `Paciente`) e o `<Stack.Screen name="Pacientes" ... />`.
- [x] Testar navegando Menu → Pacientes. Testado via `expo start --web` + `npm run mock-api`, dirigido por Playwright: navegação Menu → Pacientes ok, lista vazia renderiza "Nenhum paciente cadastrado.", sem erros de console.

Definir com a squad os campos do paciente antes de montar o form (nome, CPF,
data de nascimento, telefone, endereço etc. — o `db_clinica.json` está vazio
em `pacientes`, então o formato é livre, mas mantenha consistência com os
testes que forem feitos).

## Passo 7 (extensão) — CRUD completo de Pacientes (escrita)

- [x] Criar `src/components/PacienteForm.js`, copiando a estrutura de `MedicoForm.js`:
  campos do paciente, validação de obrigatórios, estado `salvando`, `handleSubmit`
  assíncrono com try/catch/finally, botão "Salvando..." desabilitado durante o save.
- [x] Criar `src/screens/Paciente/CadastroEdicaoPacienteScreen.js`, copiando
  `CadastroEdicaoMedicoScreen.js`: decide POST `/pacientes` (sem paciente em
  `route.params`) vs PUT `/pacientes/:id` (com paciente), lança `throw new Error(...)`
  se `resposta.ok` for falso.
- [x] Em `Paciente.js`: trocar a ação "Editar"/"Excluir" pelo mesmo padrão do
  `MedicoCard` — `navigation.navigate('PacienteForm', { paciente })` para editar;
  `Alert.alert` de confirmação + `fetch(DELETE)` + `resposta.ok` + recarregar a
  lista para excluir.
- [x] Em `App.js`: adicionar a rota `PacienteForm` apontando para
  `CadastroEdicaoPacienteScreen`, e o botão "Cadastrar Novo Paciente" na tela
  de listagem navegando para lá.
- [x] Testar cadastro, edição e exclusão, conferindo que `db_clinica.json`
  reflete as mudanças. Testado via `expo start --web` + Playwright:
  cadastro (POST) e edição (PUT) confirmados, `db_clinica.json` refletiu
  os dados corretamente em ambos os casos. A exclusão (DELETE) **não**
  chegou a disparar no alvo web: `Alert.alert` do React Native não abre
  diálogo de confirmação em `react-native-web`, então o botão "Excluir"
  fica sem efeito nesse alvo — reproduzi o mesmo teste em `Medico.js`
  (código já commitado, mesmo padrão) e o problema é idêntico lá, ou
  seja, é uma limitação preexistente do target web, não algo introduzido
  no CRUD de Paciente. Em Expo Go / emulador (mobile), `Alert.alert` é
  nativo e deve funcionar normalmente.

## Campos do paciente adotados

Como `pacientes` estava vazio e o formato era livre, foram usados os mesmos
grupos de campos do Médico (sem CRM/especialidade), para manter consistência:
`nome`, `cpf`, `dataNascimento`, `email`, `telefone`, `logradouro`, `numero`,
`complemento`, `cidade`, `uf`, `cep`.

## Cuidado ao mexer em `App.js`

Esse arquivo é compartilhado com o trabalho de Médico já commitado. Ao
mergear, mexa **só** nas linhas relativas a Paciente (import, `Stack.Screen`
de listagem, `Stack.Screen` de form) para evitar conflito com o que já foi
feito em Médico.

## Commit (Passo 6)

```bash
git add .
git commit -m "feat: consome API RESTful da clinica (CRUD de pacientes)"
git push
```
