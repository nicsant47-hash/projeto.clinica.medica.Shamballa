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

const REGEX_NOME = /^[A-Za-zÀ-ÿ.\s]{3,}$/;
const REGEX_CRM = /^[A-Z]{2}-\d{4,6}$/;
const REGEX_TELEFONE = /^\(\d{2}\)\s?\d{4,5}-\d{4}$/;
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REGEX_SENHA = /^.{6,}$/;

export default function CadastroMedicoScreen({ onVoltarParaLogin }) {
  const [nome, setNome] = useState("");
  const [crm, setCrm] = useState("");
  const [especialidade, setEspecialidade] = useState(ESPECIALIDADES[0]);
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erros, setErros] = useState({});

  function validar() {
    const novosErros = {};

    if (!REGEX_NOME.test(nome)) {
      novosErros.nome = "Nome inválido";
    }
    if (!REGEX_CRM.test(crm)) {
      novosErros.crm = "CRM inválido, use UF-000000";
    }
    if (!REGEX_TELEFONE.test(telefone)) {
      novosErros.telefone = "Telefone inválido, use (00) 00000-0000";
    }
    if (!REGEX_EMAIL.test(email)) {
      novosErros.email = "E-mail inválido";
    }
    if (!REGEX_SENHA.test(senha)) {
      novosErros.senha = "Senha deve ter no mínimo 6 caracteres";
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  function handleCadastrar() {
    if (validar()) {
      alert("Cadastro realizado com sucesso!");
    }
  }

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

      <Campo label="Nome completo" value={nome} onChangeText={setNome} placeholder="Dr. Roberto Alves" erro={erros.nome} />
      <Campo label="CRM" value={crm} onChangeText={setCrm} placeholder="SP-123456" erro={erros.crm} />

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

      <Campo label="Telefone" value={telefone} onChangeText={setTelefone} placeholder="(16) 99999-1234" keyboardType="phone-pad" erro={erros.telefone} />
      <Campo label="E-mail institucional" value={email} onChangeText={setEmail} placeholder="r.alves@clinica.com" keyboardType="email-address" autoCapitalize="none" erro={erros.email} />
      <Campo label="Senha" value={senha} onChangeText={setSenha} placeholder="••••••••" secureTextEntry erro={erros.senha} />

      <TouchableOpacity style={styles.botaoPrimario} onPress={handleCadastrar}>
        <Text style={styles.textoBotaoPrimario}>Cadastrar médico</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function Campo({ label, erro, ...props }) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={styles.label}>{label}</Text>
      <TextInput style={styles.input} placeholderTextColor="#90A4AE" {...props} />
      {erro ? <Text style={styles.erro}>{erro}</Text> : null}
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
  erro: { color: "#D32F2F", fontSize: 12, marginTop: 4 },
});
