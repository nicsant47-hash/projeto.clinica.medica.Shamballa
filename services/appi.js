import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Button,
    Alert,
    TouchableOpacity,
} from 'react-native';

const BASE_URL = 'http://192.168.15.80:3000';


export default function api() {
    const [medicos, setMedicos] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);

    // GET /medicos
    const buscarMedicos = async () => {
        setCarregando(true);
        setErro(null);
        try {
            const resposta = await fetch(`${BASE_URL}/medicos`);
            if (!resposta.ok) {
                throw new Error(`Erro HTTP ${resposta.status}`);
            }
            const dados = await resposta.json();
            setMedicos(dados);
        } catch (e) {
            setErro(e.message);
        } finally {
            setCarregando(false);
        }
    };

    useEffect(() => {
        buscarMedicos();
    }, []);

    // POST /medicos
    const criarMedico = async (dados) => {
        const resposta = await fetch(`${BASE_URL}/medicos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados),
        });

        // 201 Created é o status esperado aqui.
        if (!resposta.ok) {
            throw new Error(`Erro HTTP ${resposta.status} ao cadastrar`);
        }

        // A resposta traz o registro já com o id gerado pelo servidor.
        return await resposta.json();
    };


    // PUT /medicos/:id
    const atualizarMedico = async (id, dados) => {
        const resposta = await fetch(`${BASE_URL}/medicos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados),
        });

        if (!resposta.ok) {
            throw new Error(`Erro HTTP ${resposta.status} ao atualizar`);
        }

        return await resposta.json();
    };

    // DELETE /medicos/:id
    const excluirMedico = async (id) => {
        const resposta = await fetch(`${BASE_URL}/medicos/${id}`, {
            method: 'DELETE',
        });

        if (!resposta.ok) {
            throw new Error(`Erro HTTP ${resposta.status} ao excluir`);
        }
    };
}