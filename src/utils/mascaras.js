const somenteDigitos = (texto) => texto.replace(/\D/g, "");

export function mascaraCpf(texto) {
  const d = somenteDigitos(texto).slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

export function mascaraData(texto) {
  const d = somenteDigitos(texto).slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
}

export function mascaraTelefone(texto) {
  const d = somenteDigitos(texto).slice(0, 11);
  if (d.length === 0) return "";
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function mascaraCep(texto) {
  const d = somenteDigitos(texto).slice(0, 8);
  if (d.length <= 5) return d;
  return `${d.slice(0, 5)}-${d.slice(5)}`;
}

// Formato UF-000000: duas letras (maiúsculas) + hífen + até 6 dígitos
export function mascaraCrm(texto) {
  const limpo = texto.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const letras = limpo.replace(/[^A-Z]/g, "").slice(0, 2);
  const numeros = limpo.replace(/[^0-9]/g, "").slice(0, 6);

  if (letras.length < 2) return letras;
  if (numeros.length === 0) return texto.endsWith("-") ? `${letras}-` : letras;
  return `${letras}-${numeros}`;
}
