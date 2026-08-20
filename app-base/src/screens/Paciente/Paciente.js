// src/screens/Paciente/Paciente.js
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Button,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { BASE_URL } from '../../config';

// =========================================================================
// COMPONENTE CARD DO PACIENTE
// =========================================================================
const PacienteCard = ({ paciente, navigation, recarregar }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [excluindo, setExcluindo] = useState(false);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const handleExcluir = () => {
    Alert.alert(
      'Excluir paciente',
      `Tem certeza que deseja excluir ${paciente.nome}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            setExcluindo(true);
            try {
              const resposta = await fetch(`${BASE_URL}/pacientes/${paciente.id}`, {
                method: 'DELETE',
              });
              if (!resposta.ok) throw new Error('Não foi possível excluir o paciente.');
              await recarregar();
            } catch (erro) {
              Alert.alert('Erro', erro.message);
            } finally {
              setExcluindo(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={cardStyles.card}>
      <TouchableOpacity onPress={toggleExpand} style={cardStyles.mainInfo}>
        <View>
          <Text style={cardStyles.nome}>{paciente.nome}</Text>
          <Text style={cardStyles.subInfo}>CPF: {paciente.cpf}</Text>
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <View style={cardStyles.details}>
          <Text style={cardStyles.detailText}>Nascimento: {paciente.dataNascimento}</Text>
          <Text style={cardStyles.detailText}>Telefone: {paciente.telefone}</Text>
          <Text style={cardStyles.detailText}>Email: {paciente.email}</Text>
          <Text style={cardStyles.detailText}>
            Endereço: {paciente.logradouro}, {paciente.numero} - {paciente.cidade}/{paciente.uf}
          </Text>

          <View style={cardStyles.actionButtons}>
            <Button
              title="Editar"
              onPress={() => navigation.navigate('PacienteForm', { paciente })}
            />
            <Button
              title={excluindo ? 'Excluindo...' : 'Excluir'}
              color="red"
              disabled={excluindo}
              onPress={handleExcluir}
            />
          </View>
        </View>
      )}
    </View>
  );
};

// =========================================================================
// TELA PRINCIPAL
// =========================================================================
const Paciente = ({ navigation }) => {
  const [pacientes, setPacientes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);

  const buscarPacientes = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const resposta = await fetch(`${BASE_URL}/pacientes`);
      if (!resposta.ok) throw new Error('Falha ao buscar pacientes');
      const dados = await resposta.json();
      setPacientes(dados);
    } catch (erro) {
      setErro(erro.message);
    } finally {
      setCarregando(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      buscarPacientes();
    }, [buscarPacientes])
  );

  return (
    <View style={styles.container}>
      {carregando && (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      )}

      {!carregando && erro && (
        <View style={styles.centered}>
          <Text style={styles.erroTexto}>Erro ao carregar pacientes: {erro}</Text>
          <Button title="Tentar novamente" onPress={buscarPacientes} />
        </View>
      )}

      {!carregando && !erro && (
        <View style={styles.listWrapper}>
          <FlatList
            data={pacientes}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <PacienteCard paciente={item} navigation={navigation} recarregar={buscarPacientes} />
            )}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <Text style={styles.vazioTexto}>Nenhum paciente cadastrado.</Text>
            }
          />
        </View>
      )}

      <View style={styles.fixedButtonContainer}>
        <Button
          title="Cadastrar Novo Paciente"
          onPress={() => navigation.navigate('PacienteForm')}
        />
      </View>
    </View>
  );
};

// =========================================================================
// ESTILOS
// =========================================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  listWrapper: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  erroTexto: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  vazioTexto: {
    textAlign: 'center',
    color: '#777',
    marginTop: 20,
  },
  listContent: {
    paddingBottom: 10,
  },
  fixedButtonContainer: {
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    marginBottom: 25,
  },
});

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 5,
    marginHorizontal: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
  },
  mainInfo: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  subInfo: {
    fontSize: 14,
    color: '#555',
  },
  details: {
    padding: 15,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  detailText: {
    fontSize: 14,
    marginBottom: 5,
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
});

export default Paciente;
