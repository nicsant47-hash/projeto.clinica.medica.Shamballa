import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export default function LoginScreen({ onIrParaCadastroPaciente, onIrParaCadastroMedico, onIrParaSobreClinica }) {
  const [email, setEmail] = useState("");

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.icone}>🩺</Text>
        <Text style={styles.titulo}>Clínica App</Text>
        <Text style={styles.subtitulo}>Agende suas consultas com segurança</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>E-mail cadastrado</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          placeholder="seu.email@exemplo.com"
          placeholderTextColor="#90A4AE"
        />

        <TouchableOpacity style={styles.botaoPrimario}>
          <Text style={styles.textoBotaoPrimario}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.botaoBiometria}>
          <Text style={styles.textoBotaoBiometria}>Entrar com biometria</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onIrParaCadastroPaciente}>
          <Text style={styles.linkCadastro}>
            Ainda não tem conta? <Text style={styles.linkCadastroForte}>Cadastre-se</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onIrParaCadastroMedico}>
          <Text style={styles.linkCadastro}>
            É médico(a)? <Text style={styles.linkCadastroForte}>Cadastre-se aqui</Text>
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onIrParaSobreClinica}>
          <Text style={styles.linkCadastro}>
            <Text style={styles.linkCadastroForte}>Sobre a clínica</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 24, justifyContent: "center" },
  header: { alignItems: "center", marginBottom: 40 },
  icone: { fontSize: 40, marginBottom: 8 },
  titulo: { fontSize: 26, fontWeight: "700", color: "#0D47A1" },
  subtitulo: { fontSize: 14, color: "#607D8B", marginTop: 4 },
  form: { gap: 12 },
  label: { fontSize: 13, color: "#455A64", marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#CFD8DC",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#263238",
  },
  botaoPrimario: {
    backgroundColor: "#1565C0",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  textoBotaoPrimario: { color: "#fff", fontWeight: "600", fontSize: 15 },
  botaoBiometria: {
    borderWidth: 1.5,
    borderColor: "#1565C0",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 4,
  },
  textoBotaoBiometria: { color: "#1565C0", fontWeight: "600", fontSize: 15 },
  linkCadastro: {
    textAlign: "center",
    color: "#607D8B",
    fontSize: 13,
    marginTop: 14,
  },
  linkCadastroForte: { color: "#1565C0", fontWeight: "600" },
});
