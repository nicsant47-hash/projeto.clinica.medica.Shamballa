import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  criarSinal,
  sincronizarAgenda,
  ErroProcessamentoCancelado,
} from '../../services/processamento';

// Consultas simuladas — substitua por chamada real à API na Aula 11
function gerarConsultasSimuladas(quantidade = 200) {
  const agora = Date.now();
  return Array.from({ length: quantidade }, (_, i) => ({
    id: `c-${i}`,
    medicoId: `med-${(i % 5) + 1}`,
    inicio: new Date(agora + i * 30 * 60_000).toISOString(),
    fim:    new Date(agora + i * 30 * 60_000 + 25 * 60_000).toISOString(),
  }));
}

const ESTADO = {
  OCIOSO:        'OCIOSO',
  SINCRONIZANDO: 'SINCRONIZANDO',
  CONCLUIDO:     'CONCLUIDO',
  CANCELADO:     'CANCELADO',
  ERRO:          'ERRO',
};

export default function SincronizacaoScreen({ onVoltar }) {
  const [estado, setEstado]             = useState(ESTADO.OCIOSO);
  const [progresso, setProgresso]       = useState({ processados: 0, total: 0, porcentagem: 0 });
  const [resultado, setResultado]       = useState(null);
  const [mensagemErro, setMensagemErro] = useState('');
  const sinalRef = useRef(null);

  // Limpa sinal ao desmontar
  useEffect(() => () => { sinalRef.current?.cancelar(); }, []);

  async function iniciarSincronizacao() {
    const sinal = criarSinal();
    sinalRef.current = sinal;

    setEstado(ESTADO.SINCRONIZANDO);
    setProgresso({ processados: 0, total: 0, porcentagem: 0 });
    setResultado(null);

    try {
      const res = await sincronizarAgenda(
        () => gerarConsultasSimuladas(200),
        async (_consulta) => {
          // Simula trabalho leve por item (ex: validação / escrita local)
          await new Promise((r) => setTimeout(r, 2));
        },
        {
          tamanhoFatia: 25,
          sinal,
          aoProgresso: (p) => setProgresso({ ...p }),
        }
      );
      setResultado(res);
      setEstado(ESTADO.CONCLUIDO);
    } catch (err) {
      if (err instanceof ErroProcessamentoCancelado) {
        setEstado(ESTADO.CANCELADO);
      } else {
        setMensagemErro(err.message ?? 'Erro desconhecido');
        setEstado(ESTADO.ERRO);
      }
    }
  }

  function cancelar() {
    sinalRef.current?.cancelar();
    // estado muda quando processarEmFatias lança ErroProcessamentoCancelado
  }

  const porcentagemFormatada = Math.round(progresso.porcentagem * 100);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Sincronização de Agenda</Text>

      {estado === ESTADO.OCIOSO && (
        <>
          <Text style={styles.descricao}>
            Sincroniza a agenda local com o servidor, detectando conflitos de
            horário antes de salvar. Processamento em fatias — a UI não trava.
          </Text>
          <TouchableOpacity style={styles.botaoPrimario} onPress={iniciarSincronizacao}>
            <Text style={styles.botaoTexto}>Sincronizar agora</Text>
          </TouchableOpacity>
        </>
      )}

      {estado === ESTADO.SINCRONIZANDO && (
        <>
          <Text style={styles.status}>
            Processando… {progresso.processados} / {progresso.total}
          </Text>

          {/* Barra de progresso real */}
          <View style={styles.barraContainer}>
            <View style={[styles.barraPreenchida, { width: `${porcentagemFormatada}%` }]} />
          </View>
          <Text style={styles.porcentagem}>{porcentagemFormatada}%</Text>

          <TouchableOpacity style={styles.botaoCancelar} onPress={cancelar}>
            <Text style={styles.botaoCancelarTexto}>Cancelar</Text>
          </TouchableOpacity>
        </>
      )}

      {estado === ESTADO.CONCLUIDO && resultado && (
        <>
          <Text style={styles.statusSucesso}>Sincronização concluída</Text>
          <Text style={styles.detalhe}>{resultado.total} consultas processadas</Text>
          {resultado.conflitos > 0 ? (
            <Text style={styles.avisoConflito}>
              ⚠ {resultado.conflitos} conflito(s) de horário detectado(s)
            </Text>
          ) : (
            <Text style={styles.semConflito}>Nenhum conflito de horário</Text>
          )}
          <TouchableOpacity style={styles.botaoPrimario} onPress={() => setEstado(ESTADO.OCIOSO)}>
            <Text style={styles.botaoTexto}>Sincronizar novamente</Text>
          </TouchableOpacity>
        </>
      )}

      {estado === ESTADO.CANCELADO && (
        <>
          <Text style={styles.statusCancelado}>Sincronização cancelada</Text>
          <Text style={styles.detalhe}>
            {progresso.processados} de {progresso.total} itens processados antes do cancelamento.
          </Text>
          <TouchableOpacity style={styles.botaoPrimario} onPress={() => setEstado(ESTADO.OCIOSO)}>
            <Text style={styles.botaoTexto}>Tentar novamente</Text>
          </TouchableOpacity>
        </>
      )}

      {estado === ESTADO.ERRO && (
        <>
          <Text style={styles.statusErro}>Erro na sincronização</Text>
          <Text style={styles.detalheErro}>{mensagemErro}</Text>
          <TouchableOpacity style={styles.botaoPrimario} onPress={() => setEstado(ESTADO.OCIOSO)}>
            <Text style={styles.botaoTexto}>Tentar novamente</Text>
          </TouchableOpacity>
        </>
      )}

      <TouchableOpacity onPress={onVoltar} style={styles.linkVoltar}>
        <Text style={styles.linkVoltarTexto}>← Voltar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:           { flex: 1, padding: 24, backgroundColor: '#fff' },
  titulo:              { fontSize: 22, fontWeight: 'bold', marginBottom: 16 },
  descricao:           { fontSize: 14, color: '#555', lineHeight: 22, marginBottom: 24 },
  status:              { fontSize: 15, color: '#333', marginBottom: 12 },
  statusSucesso:       { fontSize: 16, fontWeight: '600', color: '#27ae60', marginBottom: 8 },
  statusCancelado:     { fontSize: 16, fontWeight: '600', color: '#e67e22', marginBottom: 8 },
  statusErro:          { fontSize: 16, fontWeight: '600', color: '#c0392b', marginBottom: 8 },
  detalhe:             { fontSize: 14, color: '#555', marginBottom: 12 },
  detalheErro:         { fontSize: 14, color: '#c0392b', marginBottom: 12 },
  avisoConflito:       { fontSize: 14, color: '#e67e22', marginBottom: 16 },
  semConflito:         { fontSize: 14, color: '#27ae60', marginBottom: 16 },
  porcentagem:         { textAlign: 'center', fontSize: 13, color: '#555', marginBottom: 20 },
  barraContainer:      { height: 10, backgroundColor: '#e0e0e0', borderRadius: 5, marginBottom: 6, overflow: 'hidden' },
  barraPreenchida:     { height: '100%', backgroundColor: '#2980b9', borderRadius: 5 },
  botaoPrimario:       { backgroundColor: '#2980b9', padding: 14, borderRadius: 8, alignItems: 'center', marginBottom: 12 },
  botaoTexto:          { color: '#fff', fontWeight: '600', fontSize: 15 },
  botaoCancelar:       { borderWidth: 1, borderColor: '#c0392b', padding: 12, borderRadius: 8, alignItems: 'center' },
  botaoCancelarTexto:  { color: '#c0392b', fontWeight: '600', fontSize: 15 },
  linkVoltar:          { marginTop: 24 },
  linkVoltarTexto:     { color: '#2980b9', fontSize: 14 },
});
