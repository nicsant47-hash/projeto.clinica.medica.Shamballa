# proj-clinica-squad

App mobile de agendamento de consultas — protótipo navegável das 3 primeiras
telas (Login, Cadastro de Paciente, Cadastro de Médico).

## Estrutura

```
proj-clinica-squad/
├── README.md
├── App.js               -> componente raiz, alterna entre as telas
├── index.js              -> registra o App.js como ponto de entrada
├── app.json               -> configurações do app (nome, ícone, splash)
├── package.json            -> dependências do projeto
├── assets/                  -> ícones, imagens (adicione icon.png e favicon.png aqui)
└── src/
    └── screens/
        ├── LoginScreen.js
        ├── CadastroPacienteScreen.js
        └── CadastroMedicoScreen.js
```

## Como rodar

```bash
npm install
npx expo start
```

Escaneie o QR code com o app Expo Go (Android/iOS), ou pressione `a` / `i`
no terminal para abrir no emulador/simulador, ou `w` para abrir no navegador.

## Estado atual

- Navegação entre as 3 telas feita com `useState` simples no `App.js`
  (sem lib de navegação ainda — trocar por React Navigation ou expo-router
  quando o squad decidir).
- Formulários com campos controlados, mas **sem validação nem integração
  com API ainda** — é só a camada visual/estrutural.
- Sem ícone/splash reais em `assets/` ainda — o app.json referencia
  `icon.png` e `favicon.png`; adicione os arquivos ou remova as referências
  no `app.json` se for rodar antes de ter os assets prontos.

## Próximos passos sugeridos

- Decidir e instalar a lib de navegação (React Navigation ou expo-router).
- Ligar os formulários a um `AuthContext` + serviço de API (mock com
  json-server, por exemplo).
- Adicionar validação de campos (CPF, e-mail, senha).
