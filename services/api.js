const BASE_URL = 'http://192.168.15.80:3000';

// GET /medicos
export const buscarMedicos = async () => {
    const resposta = await fetch(`${BASE_URL}/medicos`);

    if (!resposta.ok) {
        throw new Error(`Erro HTTP ${resposta.status}`);
    }

    return await resposta.json();
};

// POST /medicos
export const criarMedico = async (dados) => {
    const resposta = await fetch(`${BASE_URL}/medicos`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados),
    });

    if (!resposta.ok) {
        throw new Error(`Erro HTTP ${resposta.status} ao cadastrar`);
    }

    return await resposta.json();
};

// PUT /medicos/:id
export const atualizarMedico = async (id, dados) => {
    const resposta = await fetch(`${BASE_URL}/medicos/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados),
    });

    if (!resposta.ok) {
        throw new Error(`Erro HTTP ${resposta.status} ao atualizar`);
    }

    return await resposta.json();
};

// DELETE /medicos/:id
export const excluirMedico = async (id) => {
    const resposta = await fetch(`${BASE_URL}/medicos/${id}`, {
        method: 'DELETE',
    });

    if (!resposta.ok) {
        throw new Error(`Erro HTTP ${resposta.status} ao excluir`);
    }
};