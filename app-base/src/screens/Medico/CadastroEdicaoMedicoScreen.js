import React from 'react';
import MedicoForm from '../../components/MedicoForm'; // Ajuste o caminho
import { View } from 'react-native';
import { BASE_URL } from '../../config';

const CadastroEdicaoMedicoScreen = ({ route, navigation }) => {
  // A prop 'medico' virá via route.params
  const { medico } = route.params || {};

  const handleSave = async (novoDadosMedico) => {
    const isEditing = !!medico;
    const url = isEditing ? `${BASE_URL}/medicos/${medico.id}` : `${BASE_URL}/medicos`;

    const resposta = await fetch(url, {
      method: isEditing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoDadosMedico),
    });

    if (!resposta.ok) {
      throw new Error('Não foi possível salvar o médico.');
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1 }}>
      <MedicoForm
        medico={medico} // Passa o objeto médico (ou undefined/null)
        onSave={handleSave}
        onCancel={handleCancel}
        navigation={navigation}
      />
    </View>
  );
};

export default CadastroEdicaoMedicoScreen;
