import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

const ESPECIALIDADES = [
  "Cardiologia",
  "Dermatologia",
  "Ortopedia",
  "Pediatria",
  "Clínico Geral",
];

export default function CadastroMedicoScreen({ onVoltarParaLogin }) {
  const [nome, setNome] = useState("");
  const [crm, setCrm] = useState("");
  const [especialidade, setEspecialidade] = useState(ESPECIALIDADES[0]);
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

      <Text style={styles.titulo}>Cadastro de médico</Text>
      <Text style={styles.subtitulo}>Dados profissionais para atender na clínica</Text>

      <Campo label="Nome completo" value={nome} onChangeText={setNome} placeholder="Dr. Roberto Alves" />
      <Campo label="CRM" value={crm} onChangeText={setCrm} placeholder="SP-123456" />

      <View style={{ marginBottom: 14 }}>
        <Text style={styles.label}>Especialidade</Text>
        <View style={styles.chips}>
          {ESPECIALIDADES.map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.chip,
                especialidade === item && styles.chipSelecionado,
              ]}
              onPress={() => setEspecialidade(item)}
            >
              <Text
                style={[
                  styles.chipTexto,
                  especialidade === item && styles.chipTextoSelecionado,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Campo label="Telefone" value={telefone} onChangeText={setTelefone} placeholder="(16) 99999-1234" keyboardType="phone-pad" />
      <Campo label="E-mail institucional" value={email} onChangeText={setEmail} placeholder="r.alves@clinica.com" keyboardType="email-address" autoCapitalize="none" />
      <Campo label="Senha" value={senha} onChangeText={setSenha} placeholder="••••••••" secureTextEntry />

      <TouchableOpacity style={styles.botaoPrimario}>
        <Text style={styles.textoBotaoPrimario}>Cadastrar médico</Text>
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
  label: { fontSize: 13, color: "#455A64", marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#CFD8DC",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#263238",
  },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    borderWidth: 1,
    borderColor: "#CFD8DC",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  chipSelecionado: { backgroundColor: "#1565C0", borderColor: "#1565C0" },
  chipTexto: { fontSize: 13, color: "#455A64", fontWeight: "600" },
  chipTextoSelecionado: { color: "#fff" },
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
