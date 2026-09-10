import { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";

// Cadastro de foto de perfil via câmera — usado tanto no cadastro de
// paciente quanto no de médico. Se a permissão de câmera for negada (ou
// o dispositivo não tiver câmera, ex.: emulador web), o cadastro segue
// sem foto, com um avatar padrão. Nunca bloqueia o formulário.
export default function FotoPerfil({ uri, onFotoTirada }) {
  const [carregando, setCarregando] = useState(false);
  const [aviso, setAviso] = useState("");

  async function handleTirarFoto() {
    setAviso("");

    let permissao;
    try {
      permissao = await ImagePicker.requestCameraPermissionsAsync();
    } catch (erro) {
      setAviso("Câmera indisponível neste dispositivo. Continue sem foto.");
      return;
    }

    if (permissao.status !== "granted") {
      setAviso(
        "Sem acesso à câmera. Você pode continuar o cadastro sem foto e adicionar depois."
      );
      return;
    }

    setCarregando(true);
    try {
      const resultado = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.6,
      });

      if (!resultado.canceled) {
        onFotoTirada(resultado.assets[0].uri);
      }
    } catch (erro) {
      setAviso("Não foi possível abrir a câmera agora. Tente de novo mais tarde.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handleTirarFoto}
        style={styles.avatarWrapper}
        disabled={carregando}
      >
        {uri ? (
          <Image source={{ uri }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarPlaceholderTexto}>📷</Text>
          </View>
        )}
      </TouchableOpacity>
      <Text style={styles.legenda}>
        {uri ? "Toque para trocar a foto" : "Toque para tirar uma foto (opcional)"}
      </Text>
      {aviso ? <Text style={styles.aviso}>{aviso}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", marginBottom: 20 },
  avatarWrapper: { marginBottom: 8 },
  avatar: { width: 96, height: 96, borderRadius: 48 },
  avatarPlaceholder: {
    backgroundColor: "#ECEFF1",
    borderWidth: 1,
    borderColor: "#CFD8DC",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarPlaceholderTexto: { fontSize: 32 },
  legenda: { fontSize: 12, color: "#607D8B" },
  aviso: {
    fontSize: 11.5,
    color: "#EF6C00",
    marginTop: 4,
    textAlign: "center",
    maxWidth: 240,
  },
});
