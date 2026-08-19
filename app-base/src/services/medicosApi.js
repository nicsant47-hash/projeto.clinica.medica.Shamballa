import { BASE_URL } from '../config';

const ENDPOINT = `${BASE_URL}/medicos`;

export async function listarMedicos() {
  const resposta = await fetch(ENDPOINT);
  if (!resposta.ok) throw new Error('Falha ao buscar médicos');
  return resposta.json();
}

export async function criarMedico(dados) {
  const resposta = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });
  if (!resposta.ok) throw new Error('Falha ao criar médico');
  return resposta.json();
}

export async function atualizarMedico(id, dados) {
  const resposta = await fetch(`${ENDPOINT}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });
  if (!resposta.ok) throw new Error('Falha ao atualizar médico');
  return resposta.json();
}

export async function excluirMedico(id) {
  const resposta = await fetch(`${ENDPOINT}/${id}`, { method: 'DELETE' });
  if (!resposta.ok) throw new Error('Falha ao excluir médico');
}
