import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet } from "react-native";

import LoginScreen from "./src/screens/LoginScreen";
import CadastroPacienteScreen from "./src/screens/CadastroPacienteScreen";
import CadastroMedicoScreen from "./src/screens/CadastroMedicoScreen";
import SobreClinicaScreen from "./src/screens/SobreClinicaScreen";
import AreaLogadaScreen from "./src/screens/AreaLogadaScreen";
import { removerToken } from "./src/services/auth";

// Navegação simples por enquanto (sem lib de navegação ainda).
// Quando o squad decidir a lib (React Navigation / expo-router),
// é só trocar essa troca de estado pelas rotas.
const TELAS = {
  LOGIN: "LOGIN",
  CADASTRO_PACIENTE: "CADASTRO_PACIENTE",
  CADASTRO_MEDICO: "CADASTRO_MEDICO",
  SOBRE_CLINICA: "SOBRE_CLINICA",
  AREA_LOGADA: "AREA_LOGADA",
};

export default function App() {
  const [telaAtual, setTelaAtual] = useState(TELAS.LOGIN);
  const [loginViaBiometria, setLoginViaBiometria] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {telaAtual === TELAS.LOGIN && (
        <LoginScreen
          onIrParaCadastroPaciente={() => setTelaAtual(TELAS.CADASTRO_PACIENTE)}
          onIrParaCadastroMedico={() => setTelaAtual(TELAS.CADASTRO_MEDICO)}
          onIrParaSobreClinica={() => setTelaAtual(TELAS.SOBRE_CLINICA)}
          onLoginSucesso={({ viaBiometria }) => {
            setLoginViaBiometria(viaBiometria);
            setTelaAtual(TELAS.AREA_LOGADA);
          }}
        />
      )}

      {telaAtual === TELAS.CADASTRO_PACIENTE && (
        <CadastroPacienteScreen
          onVoltarParaLogin={() => setTelaAtual(TELAS.LOGIN)}
        />
      )}

      {telaAtual === TELAS.CADASTRO_MEDICO && (
        <CadastroMedicoScreen
          onVoltarParaLogin={() => setTelaAtual(TELAS.LOGIN)}
        />
      )}

      {telaAtual === TELAS.SOBRE_CLINICA && (
        <SobreClinicaScreen
          onVoltarParaLogin={() => setTelaAtual(TELAS.LOGIN)}
        />
      )}

      {telaAtual === TELAS.AREA_LOGADA && (
        <AreaLogadaScreen
          viaBiometria={loginViaBiometria}
          onSair={async () => {
            // Sair da conta remove o token salvo — a próxima entrada
            // exige e-mail/senha de novo (sem token, o botão de
            // biometria não aparece; ver biometriaDisponivel()).
            await removerToken();
            setTelaAtual(TELAS.LOGIN);
          }}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
});
