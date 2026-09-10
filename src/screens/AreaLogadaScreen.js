import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

// Tela placeholder pós-login. O objetivo aqui é só fechar o fluxo de
// autenticação (senha OU biometria destravando o token) — o conteúdo
// real da área logada (agenda, consultas etc.) fica para outra etapa.
export default function AreaLogadaScreen({ viaBiometria, onSair }) {
  return (
    <View style={styles.container}>
      <Text style={styles.icone}>{viaBiometria ? "🔓" : "✅"}</Text>
      <Text style={styles.titulo}>Login realizado</Text>
      <Text style={styles.subtitulo}>
        {viaBiometria
          ? "Você entrou destravando o token salvo com biometria."
          : "Você entrou com e-mail e senha."}
      </Text>

      <TouchableOpacity style={styles.botaoSair} onPress={onSair}>
        <Text style={styles.textoBotaoSair}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 24, justifyContent: "center", alignItems: "center" },
  icone: { fontSize: 48, marginBottom: 12 },
  titulo: { fontSize: 20, fontWeight: "700", color: "#0D47A1" },
  subtitulo: { fontSize: 14, color: "#607D8B", marginTop: 8, textAlign: "center", maxWidth: 280 },
  botaoSair: {
    marginTop: 32,
    borderWidth: 1.5,
    borderColor: "#1565C0",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 28,
  },
  textoBotaoSair: { color: "#1565C0", fontWeight: "600", fontSize: 15 },
});
