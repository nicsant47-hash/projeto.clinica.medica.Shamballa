import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";

import {
  salvarToken,
  biometriaDisponivel,
  autenticarComBiometria,
} from "../services/auth";

const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen({
  onIrParaCadastroPaciente,
  onIrParaCadastroMedico,
  onIrParaSobreClinica,
  onLoginSucesso,
}) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [mostrarBotaoBiometria, setMostrarBotaoBiometria] = useState(false);
  const [carregandoBiometria, setCarregandoBiometria] = useState(false);

  // Ao abrir a tela, checa se dá pra oferecer "Entrar com biometria"
  // (hardware + biometria cadastrada no aparelho + token salvo de um
  // login anterior). Se qualquer coisa não bater, o botão simplesmente
  // não aparece — a tela de senha continua funcionando normalmente.
  useEffect(() => {
    let ativo = true;

    biometriaDisponivel().then((disponivel) => {
      if (ativo) setMostrarBotaoBiometria(disponivel);
    });

    return () => {
      ativo = false;
    };
  }, []);

  function validar() {
    if (!REGEX_EMAIL.test(email)) {
      setErro("E-mail inválido");
      return false;
    }
    if (senha.length < 6) {
      setErro("Senha deve ter no mínimo 6 caracteres");
      return false;
    }
    setErro("");
    return true;
  }

  async function handleEntrar() {
    if (!validar()) return;

    // Login por senha real ainda depende de um endpoint de autenticação
    // (fora do escopo desta etapa). Por enquanto, simulamos a resposta
    // da API — o que importa aqui é: assim que existir um token de
    // sessão, ele é salvo com segurança para a biometria poder usá-lo
    // depois (é esse token que a Aula 4 introduziu).
    const tokenSimulado = `token-${email}-${Date.now()}`;
    await salvarToken(tokenSimulado);

    onLoginSucesso({ viaBiometria: false });
  }

  async function handleEntrarComBiometria() {
    setCarregandoBiometria(true);
    try {
      const token = await autenticarComBiometria();

      if (!token) {
        // Cancelado, não reconhecido, ou biometria indisponível agora:
        // não é erro fatal, só volta para o login por senha.
        setErro("Não foi possível confirmar a biometria. Entre com e-mail e senha.");
        return;
      }

      onLoginSucesso({ viaBiometria: true });
    } finally {
      setCarregandoBiometria(false);
    }
  }

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

        <Text style={styles.label}>Senha</Text>
        <TextInput
          style={styles.input}
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          placeholder="••••••••"
          placeholderTextColor="#90A4AE"
        />

        {erro ? <Text style={styles.erro}>{erro}</Text> : null}

        <TouchableOpacity style={styles.botaoPrimario} onPress={handleEntrar}>
          <Text style={styles.textoBotaoPrimario}>Entrar</Text>
        </TouchableOpacity>

        {mostrarBotaoBiometria && (
          <TouchableOpacity
            style={styles.botaoBiometria}
            onPress={handleEntrarComBiometria}
            disabled={carregandoBiometria}
          >
            {carregandoBiometria ? (
              <ActivityIndicator color="#1565C0" />
            ) : (
              <Text style={styles.textoBotaoBiometria}>🔓 Entrar com biometria</Text>
            )}
          </TouchableOpacity>
        )}

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
  erro: { color: "#D32F2F", fontSize: 12, marginTop: -4 },
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
    minHeight: 46,
    justifyContent: "center",
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
