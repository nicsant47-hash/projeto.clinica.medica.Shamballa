import * as SecureStore from "expo-secure-store";
import * as LocalAuthentication from "expo-local-authentication";

const CHAVE_TOKEN = "clinica_token_sessao";

// Salva o token de sessão (o mesmo conceito de token de autenticação da
// Aula 4) no armazenamento seguro do dispositivo. É esse token salvo que
// a biometria "destrava" depois, sem pedir e-mail/senha de novo.
export async function salvarToken(token) {
  await SecureStore.setItemAsync(CHAVE_TOKEN, token);
}

export async function obterToken() {
  return SecureStore.getItemAsync(CHAVE_TOKEN);
}

export async function removerToken() {
  await SecureStore.deleteItemAsync(CHAVE_TOKEN);
}

// Diz se dá pra oferecer o botão "Entrar com biometria":
// - o aparelho tem sensor de biometria (digital/face)
// - existe pelo menos uma biometria cadastrada no sistema
// - já existe um token salvo de um login anterior por senha
// Se qualquer uma falhar, a resposta é só "não oferece o botão" — nunca
// lança erro. Quem chama decide como seguir (aqui: cai para login normal).
export async function biometriaDisponivel() {
  try {
    const temHardware = await LocalAuthentication.hasHardwareAsync();
    if (!temHardware) return false;

    const temBiometriaCadastrada = await LocalAuthentication.isEnrolledAsync();
    if (!temBiometriaCadastrada) return false;

    const token = await obterToken();
    return !!token;
  } catch (erro) {
    console.warn("Não foi possível checar biometria:", erro.message);
    return false;
  }
}

// Pede a biometria do sistema operacional e, se confirmada, devolve o
// token salvo. Permissão negada, biometria não reconhecida, cancelamento
// pelo usuário ou qualquer erro de hardware: tudo devolve null em vez de
// lançar exceção — a tela de login volta pro fluxo de senha normal.
export async function autenticarComBiometria() {
  try {
    const resultado = await LocalAuthentication.authenticateAsync({
      promptMessage: "Entrar na Clínica App",
      cancelLabel: "Usar senha",
      fallbackLabel: "Usar senha",
      disableDeviceFallback: false,
    });

    if (!resultado.success) {
      return null;
    }

    return await obterToken();
  } catch (erro) {
    console.warn("Biometria indisponível agora:", erro.message);
    return null;
  }
}
