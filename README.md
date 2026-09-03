# proj-clinica-squad

App mobile de agendamento de consultas — protótipo navegável das telas de
Login, Cadastro de Paciente, Cadastro de Médico e Sobre a Clínica.

## Estrutura

```
proj-clinica-squad/
├── README.md
├── App.js               -> componente raiz, alterna entre as telas
├── index.js              -> registra o App.js como ponto de entrada
├── app.json               -> configurações do app (nome, ícone, splash)
├── package.json            -> dependências do projeto
├── assets/                  -> ícones, imagens (adicione icon.png e favicon.png aqui)
├── services/
│   └── api.js                -> cliente HTTP da NOSSA API (autenticada)
├── docs/
│   └── decisoes/               -> registros de decisão arquitetural (ADRs)
│       ├── 00-mapeamento-dependencias-externas.md
│       ├── ADR-01-mapas.md
│       ├── ADR-02-push-notificacoes.md
│       ├── ADR-03-sms.md
│       ├── ADR-04-cep.md
│       └── ADR-05-geocoding.md
└── src/
    ├── screens/
    │   ├── LoginScreen.js
    │   ├── CadastroPacienteScreen.js   -> inclui CEP com autofill via ViaCEP
    │   ├── CadastroMedicoScreen.js
    │   └── SobreClinicaScreen.js       -> geocoding do endereço via Nominatim
    └── services/
        ├── httpExterno.js    -> cliente HTTP para serviços de TERCEIROS
        ├── viacep.js          -> consulta de CEP (ViaCEP)
        └── geocoding.js        -> geocoding de endereço (Nominatim/OSM)
```

Antes de mexer em qualquer integração externa nova, veja
[docs/decisoes/](docs/decisoes/) — é lá que fica registrado por que cada
serviço foi escolhido, quais as alternativas consideradas e o que o app faz
se aquele serviço sair do ar.

## Como rodar

```bash
npm install
npx expo start
```

Escaneie o QR code com o app Expo Go (Android/iOS), ou pressione `a` / `i`
no terminal para abrir no emulador/simulador, ou `w` para abrir no navegador.

## Estado atual

- Navegação entre as telas feita com `useState` simples no `App.js`
  (sem lib de navegação ainda — trocar por React Navigation ou expo-router
  quando o squad decidir).
- Formulários com campos controlados e validação por regex (CPF, e-mail,
  senha, CEP etc.) — ainda sem ligação com a API de cadastro de pacientes.
- Cadastro de médico já chama a API própria (`services/api.js`).
- **CEP no cadastro de paciente:** ao sair do campo de CEP (`onBlur`) com 8
  dígitos, o formulário consulta o ViaCEP (`src/services/viacep.js`) e
  preenche logradouro/bairro/cidade/UF automaticamente — os campos continuam
  editáveis e o cadastro nunca fica bloqueado se a consulta falhar.
- **Sobre a clínica:** geocodifica o endereço fixo da clínica via Nominatim
  (`src/services/geocoding.js`) e mostra as coordenadas, com crédito ao
  OpenStreetMap. Resultado é cacheado em memória (a política do Nominatim
  exige isso, e o endereço da clínica não muda).
- `src/services/httpExterno.js` é o cliente usado por toda integração de
  terceiro (timeout, `User-Agent`, tratamento de `429`, erro
  `ServicoExternoIndisponivel`) — **nunca** envia o token da nossa API para
  fora. Ver [ADR-04](docs/decisoes/ADR-04-cep.md) e
  [ADR-05](docs/decisoes/ADR-05-geocoding.md) para o raciocínio completo.
- Sem ícone/splash reais em `assets/` ainda — o app.json referencia
  `icon.png` e `favicon.png`; adicione os arquivos ou remova as referências
  no `app.json` se for rodar antes de ter os assets prontos.

## Próximos passos sugeridos

- Decidir e instalar a lib de navegação (React Navigation ou expo-router).
- Ligar o cadastro de paciente a um `AuthContext` + `services/api.js`.
- Push (Aula 9), mapa (Aula 12) e SMS (Aula 13): decisão já registrada em
  `docs/decisoes/`, implementação ainda pendente — ver as armadilhas
  anotadas em cada ADR antes de começar.
