import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet } from "react-native";

import LoginScreen from "./src/screens/LoginScreen";
import CadastroPacienteScreen from "./src/screens/CadastroPacienteScreen";
import CadastroMedicoScreen from "./src/screens/CadastroMedicoScreen";

// Navegação simples por enquanto (sem lib de navegação ainda).
// Quando o squad decidir a lib (React Navigation / expo-router),
// é só trocar essa troca de estado pelas rotas.
const TELAS = {
  LOGIN: "LOGIN",
  CADASTRO_PACIENTE: "CADASTRO_PACIENTE",
  CADASTRO_MEDICO: "CADASTRO_MEDICO",
};

export default function App() {
  const [telaAtual, setTelaAtual] = useState(TELAS.LOGIN);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {telaAtual === TELAS.LOGIN && (
        <LoginScreen
          onIrParaCadastroPaciente={() => setTelaAtual(TELAS.CADASTRO_PACIENTE)}
          onIrParaCadastroMedico={() => setTelaAtual(TELAS.CADASTRO_MEDICO)}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
});
