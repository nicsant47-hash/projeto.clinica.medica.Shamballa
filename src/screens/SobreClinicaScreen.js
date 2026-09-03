import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";

import { geocodificar } from "../services/geocoding";

// Endereço da clínica: fixo, cadastrado uma vez pela equipe — é por isso
// que faz sentido geocodificar e cachear (ADR-05), em vez de tratar como
// endereço de usuário que muda a cada cadastro.
const ENDERECO_CLINICA = {
  logradouro: "Avenida Paulista, 1000",
  cidade: "São Paulo",
  uf: "SP",
};

export default function SobreClinicaScreen({ onVoltarParaLogin }) {
  const [coordenadas, setCoordenadas] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [aviso, setAviso] = useState("");

  useEffect(() => {
    let ativo = true;

    geocodificar(ENDERECO_CLINICA)
      .then((resultado) => {
        if (ativo) setCoordenadas(resultado);
      })
      .catch((erro) => {
        if (ativo) setAviso(erro.message || "Coordenadas indisponíveis no momento.");
      })
      .finally(() => {
        if (ativo) setCarregando(false);
      });

    return () => {
      ativo = false;
    };
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onVoltarParaLogin} style={styles.voltar}>
        <Text style={styles.voltarTexto}>‹ Voltar</Text>
      </TouchableOpacity>

      <Text style={styles.titulo}>Sobre a clínica</Text>

      <Text style={styles.label}>Endereço</Text>
      <Text style={styles.valor}>
        {ENDERECO_CLINICA.logradouro} — {ENDERECO_CLINICA.cidade}/{ENDERECO_CLINICA.uf}
      </Text>

      <Text style={styles.label}>Coordenadas</Text>
      {carregando && <ActivityIndicator color="#1565C0" style={{ marginTop: 6 }} />}
      {!carregando && coordenadas && (
        <Text style={styles.valor}>
          {coordenadas.latitude.toFixed(6)}, {coordenadas.longitude.toFixed(6)}
        </Text>
      )}
      {!carregando && !coordenadas && aviso ? <Text style={styles.aviso}>{aviso}</Text> : null}

      {/* Política de uso do Nominatim/OpenStreetMap exige atribuição visível. */}
      <Text style={styles.credito}>
        Localização calculada com dados © colaboradores do OpenStreetMap (via Nominatim).
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 24, paddingTop: 50 },
  voltar: { marginBottom: 16 },
  voltarTexto: { color: "#1565C0", fontSize: 15, fontWeight: "600" },
  titulo: { fontSize: 22, fontWeight: "700", color: "#0D47A1", marginBottom: 24 },
  label: { fontSize: 13, color: "#455A64", marginTop: 16 },
  valor: { fontSize: 15, color: "#263238", marginTop: 4 },
  aviso: { fontSize: 13, color: "#EF6C00", marginTop: 4 },
  credito: { fontSize: 11, color: "#90A4AE", marginTop: 40 },
});
