import React from 'react';
import MedicoForm from '../../components/MedicoForm'; // Ajuste o caminho
import { View } from 'react-native';
import { criarMedico, atualizarMedico } from '../../services/medicosApi';

const CadastroEdicaoMedicoScreen = ({ route, navigation, recarregarMedicos }) => {
  // A prop 'medico' virá via route.params
  const { medico } = route.params || {};

  const handleSave = async (novoDadosMedico) => {
    if (medico && medico.id) {
      await atualizarMedico(medico.id, novoDadosMedico);
    } else {
      await criarMedico(novoDadosMedico);
    }
    await recarregarMedicos();
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
