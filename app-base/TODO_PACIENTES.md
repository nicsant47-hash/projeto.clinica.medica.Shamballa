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

- [ ] Reescrever [src/screens/Paciente/Paciente.js](src/screens/Paciente/Paciente.js) (hoje é só um texto placeholder).
- [ ] Importar `BASE_URL` de `../../config`.
- [ ] Estados: `pacientes`, `carregando`, `erro` (mesmo padrão do `Medico.js`).
- [ ] Função `buscarPacientes()` assíncrona: `fetch`, checar `resposta.ok`, `.json()`, `try/catch/finally`.
- [ ] Chamar com `useFocusEffect` (não `useEffect` simples), igual foi feito em `Medico.js`.
- [ ] Renderizar os três estados: `ActivityIndicator` (carregando), mensagem de erro + botão "Tentar novamente" (erro), `FlatList` simples (sucesso) — não precisa de `SectionList`/agrupamento por letra, isso é só em Médico.
- [ ] Em [App.js](App.js): descomentar o import de `Paciente` (trocar `Op2Screen` pelo nome real exportado, que deve ser `Paciente`) e o `<Stack.Screen name="Pacientes" ... />`.
- [ ] Testar navegando Menu → Pacientes.

Definir com a squad os campos do paciente antes de montar o form (nome, CPF,
data de nascimento, telefone, endereço etc. — o `db_clinica.json` está vazio
em `pacientes`, então o formato é livre, mas mantenha consistência com os
testes que forem feitos).

## Passo 7 (extensão) — CRUD completo de Pacientes (escrita)

- [ ] Criar `src/components/PacienteForm.js`, copiando a estrutura de `MedicoForm.js`:
  campos do paciente, validação de obrigatórios, estado `salvando`, `handleSubmit`
  assíncrono com try/catch/finally, botão "Salvando..." desabilitado durante o save.
- [ ] Criar `src/screens/Paciente/CadastroEdicaoPacienteScreen.js`, copiando
  `CadastroEdicaoMedicoScreen.js`: decide POST `/pacientes` (sem paciente em
  `route.params`) vs PUT `/pacientes/:id` (com paciente), lança `throw new Error(...)`
  se `resposta.ok` for falso.
- [ ] Em `Paciente.js`: trocar a ação "Editar"/"Excluir" pelo mesmo padrão do
  `MedicoCard` — `navigation.navigate('PacienteForm', { paciente })` para editar;
  `Alert.alert` de confirmação + `fetch(DELETE)` + `resposta.ok` + recarregar a
  lista para excluir.
- [ ] Em `App.js`: adicionar a rota `PacienteForm` apontando para
  `CadastroEdicaoPacienteScreen`, e o botão "Cadastrar Novo Paciente" na tela
  de listagem navegando para lá.
- [ ] Testar cadastro, edição e exclusão, conferindo que `db_clinica.json`
  reflete as mudanças.

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
