import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import { consultarCep } from "../services/viacep";

const REGEX_NOME = /^[A-Za-zÀ-ÿ\s]{3,}$/;
const REGEX_CPF = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
const REGEX_NASCIMENTO = /^\d{2}\/\d{2}\/\d{4}$/;
const REGEX_TELEFONE = /^\(\d{2}\)\s?\d{4,5}-\d{4}$/;
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REGEX_SENHA = /^.{6,}$/;
const REGEX_CEP = /^\d{5}-?\d{3}$/;

export default function CadastroPacienteScreen({ onVoltarParaLogin }) {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [cep, setCep] = useState("");
  const [logradouro, setLogradouro] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [uf, setUf] = useState("");
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [avisoCep, setAvisoCep] = useState("");
  const [erros, setErros] = useState({});

  // Dispara no onBlur, não a cada tecla: consultar a cada dígito digitado
  // queima cota do ViaCEP à toa e atrapalha quem está digitando.
  async function handleCepBlur() {
    const cepLimpo = cep.replace(/\D/g, "");
    setAvisoCep("");

    if (cepLimpo.length !== 8) {
      return;
    }

    setBuscandoCep(true);
    try {
      const endereco = await consultarCep(cepLimpo);

      if (!endereco) {
        setAvisoCep("CEP não encontrado. Preencha o endereço manualmente.");
        return;
      }

      setLogradouro(endereco.logradouro || "");
      setBairro(endereco.bairro || "");
      setCidade(endereco.cidade || "");
      setUf(endereco.uf || "");
    } catch (erro) {
      // Falha (timeout, 429, serviço fora do ar): aviso, não erro fatal.
      // O cadastro continua possível preenchendo o endereço à mão.
      setAvisoCep(erro.message || "Não foi possível buscar o endereço agora. Preencha manualmente.");
    } finally {
      setBuscandoCep(false);
    }
  }

  function validar() {
    const novosErros = {};

    if (!REGEX_NOME.test(nome)) {
      novosErros.nome = "Nome inválido";
    }
    if (!REGEX_CPF.test(cpf)) {
      novosErros.cpf = "CPF inválido, use 000.000.000-00";
    }
    if (!REGEX_NASCIMENTO.test(nascimento)) {
      novosErros.nascimento = "Data inválida, use DD/MM/AAAA";
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
    if (!REGEX_CEP.test(cep)) {
      novosErros.cep = "CEP inválido, use 00000-000";
    }
    if (!logradouro.trim()) {
      novosErros.logradouro = "Logradouro é obrigatório";
    }
    if (!cidade.trim()) {
      novosErros.cidade = "Cidade é obrigatória";
    }
    if (!uf.trim()) {
      novosErros.uf = "UF é obrigatória";
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

      <Text style={styles.titulo}>Cadastro de paciente</Text>
      <Text style={styles.subtitulo}>Crie sua conta para agendar consultas</Text>

      <Campo label="Nome completo" value={nome} onChangeText={setNome} placeholder="Ana Beatriz Souza" erro={erros.nome} />
      <Campo label="CPF" value={cpf} onChangeText={setCpf} placeholder="000.000.000-00" keyboardType="numeric" erro={erros.cpf} />
      <Campo label="Data de nascimento" value={nascimento} onChangeText={setNascimento} placeholder="DD/MM/AAAA" keyboardType="numeric" erro={erros.nascimento} />
      <Campo label="Telefone" value={telefone} onChangeText={setTelefone} placeholder="(16) 99999-0001" keyboardType="phone-pad" erro={erros.telefone} />
      <Campo label="E-mail" value={email} onChangeText={setEmail} placeholder="ana.souza@email.com" keyboardType="email-address" autoCapitalize="none" erro={erros.email} />
      <Campo label="Senha" value={senha} onChangeText={setSenha} placeholder="••••••••" secureTextEntry erro={erros.senha} />

      <View style={{ marginBottom: 14 }}>
        <Text style={styles.label}>CEP</Text>
        <View style={styles.linhaCep}>
          <TextInput
            style={[styles.input, styles.inputCep]}
            placeholderTextColor="#90A4AE"
            value={cep}
            onChangeText={setCep}
            onBlur={handleCepBlur}
            placeholder="00000-000"
            keyboardType="numeric"
            maxLength={9}
          />
          {buscandoCep && <ActivityIndicator style={styles.indicadorCep} color="#1565C0" />}
        </View>
        {erros.cep ? <Text style={styles.erro}>{erros.cep}</Text> : null}
        {!erros.cep && avisoCep ? <Text style={styles.aviso}>{avisoCep}</Text> : null}
      </View>

      <Campo label="Logradouro" value={logradouro} onChangeText={setLogradouro} placeholder="Rua, avenida..." erro={erros.logradouro} />
      <Campo label="Bairro" value={bairro} onChangeText={setBairro} placeholder="Bairro" erro={erros.bairro} />
      <Campo label="Cidade" value={cidade} onChangeText={setCidade} placeholder="Cidade" erro={erros.cidade} />
      <Campo label="UF" value={uf} onChangeText={(texto) => setUf(texto.toUpperCase())} placeholder="SP" maxLength={2} autoCapitalize="characters" erro={erros.uf} />

      <TouchableOpacity style={styles.botaoPrimario} onPress={handleCadastrar}>
        <Text style={styles.textoBotaoPrimario}>Criar conta</Text>
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
  erro: { color: "#D32F2F", fontSize: 12, marginTop: 4 },
  aviso: { color: "#EF6C00", fontSize: 12, marginTop: 4 },
  linhaCep: { flexDirection: "row", alignItems: "center" },
  inputCep: { flex: 1 },
  indicadorCep: { marginLeft: 10 },
});
