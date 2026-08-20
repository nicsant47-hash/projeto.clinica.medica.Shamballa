import React from 'react';
import PacienteForm from '../../components/PacienteForm';
import { View } from 'react-native';
import { BASE_URL } from '../../config';

const CadastroEdicaoPacienteScreen = ({ route, navigation }) => {
  // A prop 'paciente' virá via route.params
  const { paciente } = route.params || {};

  const handleSave = async (novoDadosPaciente) => {
    const isEditing = !!paciente;
    const url = isEditing ? `${BASE_URL}/pacientes/${paciente.id}` : `${BASE_URL}/pacientes`;

    const resposta = await fetch(url, {
      method: isEditing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoDadosPaciente),
    });

    if (!resposta.ok) {
      throw new Error('Não foi possível salvar o paciente.');
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1 }}>
      <PacienteForm
        paciente={paciente}
        onSave={handleSave}
        onCancel={handleCancel}
        navigation={navigation}
      />
    </View>
  );
};

export default CadastroEdicaoPacienteScreen;
