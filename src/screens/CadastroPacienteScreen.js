import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

export default function CadastroPacienteScreen({ onVoltarParaLogin }) {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.conteudo}
      keyboardShouldPersistTaps="handled"
    >
      <TouchableOpacity onPress={onVoltarParaLogin} style={styles.voltar}>
        <Text style={styles.voltarTexto}>‹ Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.titulo}>Cadastro de paciente</Text>
      <Text style={styles.subtitulo}>Crie sua conta para agendar consultas</Text>

      <Campo label="Nome completo" value={nome} onChangeText={setNome} placeholder="Ana Beatriz Souza" />
      <Campo label="CPF" value={cpf} onChangeText={setCpf} placeholder="000.000.000-00" keyboardType="numeric" />
      <Campo label="Data de nascimento" value={nascimento} onChangeText={setNascimento} placeholder="DD/MM/AAAA" keyboardType="numeric" />
      <Campo label="Telefone" value={telefone} onChangeText={setTelefone} placeholder="(16) 99999-0001" keyboardType="phone-pad" />
      <Campo label="E-mail" value={email} onChangeText={setEmail} placeholder="ana.souza@email.com" keyboardType="email-address" autoCapitalize="none" />
      <Campo label="Senha" value={senha} onChangeText={setSenha} placeholder="••••••••" secureTextEntry />

      <TouchableOpacity style={styles.botaoPrimario}>
        <Text style={styles.textoBotaoPrimario}>Criar conta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function Campo({ label, ...props }) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} placeholderTextColor="#90A4AE" {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  conteudo: { padding: 24, paddingTop: 50 },
  voltar: { marginBottom: 16 },
  voltarTexto: { color: "#1565C0", fontSize: 15, fontWeight: "600" },
  titulo: { fontSize: 22, fontWeight: "700", color: "#0D47A1" },
  subtitulo: { fontSize: 13.5, color: "#607D8B", marginTop: 4, marginBottom: 24 },
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
    marginBottom: 40,
  },
  textoBotaoPrimario: { color: "#fff", fontWeight: "600", fontSize: 15 },
});
