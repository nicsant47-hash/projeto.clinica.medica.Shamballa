import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';

// Estado inicial vazio para um novo paciente
const initialPacienteState = {
  nome: '',
  cpf: '',
  dataNascimento: '',
  email: '',
  telefone: '',
  logradouro: '',
  numero: '',
  complemento: '',
  cidade: '',
  uf: '',
  cep: '',
};

/**
 * Componente PacienteForm para Cadastro ou Edição.
 * @param {object} props.paciente - Objeto do paciente para edição, ou null para cadastro.
 * @param {function} props.onSave - Função chamada ao concluir com sucesso.
 * @param {function} props.onCancel - Função chamada ao cancelar.
 * @param {object} props.navigation - Objeto de navegação.
 */
const PacienteForm = ({ paciente, onSave, onCancel, navigation }) => {
  const [formData, setFormData] = useState(paciente || initialPacienteState);
  const [errors, setErrors] = useState({});
  const [salvando, setSalvando] = useState(false);

  const isEditing = !!paciente;
  const buttonTitle = isEditing ? 'Concluir Edição' : 'Concluir Cadastro';

  const requiredFields = [
    'nome', 'cpf', 'dataNascimento', 'telefone',
    'logradouro', 'numero', 'cidade', 'uf', 'cep',
  ];

  useEffect(() => {
    setFormData(paciente || initialPacienteState);
  }, [paciente]);

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = () => {
    let valid = true;
    const newErrors = {};

    requiredFields.forEach(field => {
      if (!formData[field] || String(formData[field]).trim() === '') {
        newErrors[field] = 'Campo Obrigatório';
        valid = false;
      }
    });

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setSalvando(true);
    try {
      await onSave(formData);
      Alert.alert(
        isEditing ? 'Sucesso' : 'Cadastro Concluído',
        isEditing ? 'Dados do paciente atualizados.' : 'Novo paciente cadastrado com sucesso!'
      );
      navigation.goBack();
    } catch (erro) {
      Alert.alert('Erro', erro.message || 'Não foi possível salvar o paciente.');
    } finally {
      setSalvando(false);
    }
  };

  const ValidatedInput = ({ label, name, ...props }) => (
    <View style={formStyles.inputGroup}>
      <Text style={formStyles.label}>{label}</Text>
      <TextInput
        style={[formStyles.input, errors[name] && formStyles.inputError]}
        value={formData[name]}
        onChangeText={(text) => handleChange(name, text)}
        {...props}
      />
      {errors[name] && <Text style={formStyles.errorText}>{errors[name]}</Text>}
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        <Text style={styles.title}>{isEditing ? 'Editar Paciente' : 'Novo Cadastro'}</Text>

        {/* ====================================
            1. DADOS PESSOAIS
            ==================================== */}
        <Text style={styles.sectionHeader}>1. Dados Pessoais</Text>
        <ValidatedInput
          label="Nome Completo"
          name="nome"
          placeholder="Ex: Ana Maria da Silva"
        />
        <ValidatedInput
          label="CPF"
          name="cpf"
          placeholder="XXX.XXX.XXX-XX"
          keyboardType="numeric"
          maxLength={14}
        />
        <ValidatedInput
          label="Data de Nascimento"
          name="dataNascimento"
          placeholder="DD/MM/AAAA"
        />

        {/* ====================================
            2. CONTATOS
            ==================================== */}
        <Text style={styles.sectionHeader}>2. Contatos</Text>
        <ValidatedInput
          label="Email"
          name="email"
          placeholder="email@exemplo.com"
          keyboardType="email-address"
        />
        <ValidatedInput
          label="Telefone Celular"
          name="telefone"
          placeholder="(XX) XXXXX-XXXX"
          keyboardType="phone-pad"
        />

        {/* ====================================
            3. ENDEREÇO
            ==================================== */}
        <Text style={styles.sectionHeader}>3. Endereço</Text>
        <ValidatedInput
          label="Logradouro"
          name="logradouro"
          placeholder="Ex: Rua das Flores"
        />
        <View style={formStyles.row}>
          <ValidatedInput
            label="Número"
            name="numero"
            placeholder="Nº"
            keyboardType="numeric"
            style={formStyles.inputHalf}
          />
          <ValidatedInput
            label="Complemento"
            name="complemento"
            placeholder="Apto/Sala (Opcional)"
            style={formStyles.inputHalf}
          />
        </View>
        <ValidatedInput
          label="Cidade"
          name="cidade"
          placeholder="Ex: Belo Horizonte"
        />
        <View style={formStyles.row}>
          <ValidatedInput
            label="UF"
            name="uf"
            placeholder="Ex: MG"
            maxLength={2}
            style={formStyles.inputQuarter}
          />
          <ValidatedInput
            label="CEP"
            name="cep"
            placeholder="XXXXX-XXX"
            keyboardType="numeric"
            maxLength={9}
            style={formStyles.inputThreeQuarter}
          />
        </View>
      </ScrollView>

      {/* BOTÕES FIXOS NA PARTE INFERIOR */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[formStyles.button, formStyles.saveButton]}
          onPress={handleSubmit}
          disabled={salvando}
        >
          <Text style={formStyles.buttonText}>{salvando ? 'Salvando...' : buttonTitle}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[formStyles.button, formStyles.cancelButton]}
          onPress={onCancel || (() => navigation.goBack())}
          disabled={salvando}
        >
          <Text style={formStyles.buttonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// =========================================================================
// ESTILOS DO FORMULÁRIO
// =========================================================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#007AFF',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 5,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

const formStyles = StyleSheet.create({
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    fontWeight: '500',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    height: 45,
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 2,
    backgroundColor: '#ffe8e8',
  },
  errorText: {
    fontSize: 12,
    color: 'red',
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  inputHalf: {
    flex: 1,
  },
  inputQuarter: {
    flex: 0.3,
  },
  inputThreeQuarter: {
    flex: 0.7,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  saveButton: {
    backgroundColor: '#007AFF',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PacienteForm;
