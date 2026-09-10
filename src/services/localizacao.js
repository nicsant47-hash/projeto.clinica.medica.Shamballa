import * as Location from "expo-location";

// Fórmula de Haversine — distância em linha reta entre duas coordenadas,
// em km. É uma estimativa (não é rota real de carro/trânsito); o texto
// na tela deixa isso claro para não passar falsa precisão.
function distanciaEmKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const toRad = (graus) => (graus * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// Velocidade média assumida só para estimar tempo de carro até a
// clínica, já que não estamos calculando rota real (isso é assunto do
// ADR-01, quando o mapa com rotas entrar no app).
const VELOCIDADE_MEDIA_KMH = 35;

export function estimarTempoMinutos(distanciaKm) {
  return Math.round((distanciaKm / VELOCIDADE_MEDIA_KMH) * 60);
}

// Pede permissão de localização e devolve { distanciaKm, tempoMinutos }
// até a clínica. Se a permissão for negada, ou o GPS estiver desligado,
// ou a leitura falhar por qualquer motivo, devolve null — nunca lança
// erro. A tela "Sobre a clínica" já mostra endereço e coordenadas fixas
// sem depender disso, então o app continua útil de qualquer forma.
export async function obterDistanciaAteClinica(coordenadasClinica) {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      return null;
    }

    const posicao = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    const distanciaKm = distanciaEmKm(
      posicao.coords.latitude,
      posicao.coords.longitude,
      coordenadasClinica.latitude,
      coordenadasClinica.longitude
    );

    return {
      distanciaKm,
      tempoMinutos: estimarTempoMinutos(distanciaKm),
    };
  } catch (erro) {
    console.warn("Localização indisponível agora:", erro.message);
    return null;
  }
}
