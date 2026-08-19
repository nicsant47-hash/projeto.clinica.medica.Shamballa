// App.js (Usando React Navigation como exemplo de estrutura profissional)
import React, { useState, useEffect, useCallback } from 'react';
import {View, Text, StyleSheet} from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Importa todos os componentes de tela
import Splash from './src/screens/Splash/Splash';
import MenuScreen from './src/screens/Menu/MenuScreen';
import Medico from './src/screens/Medico/Medico';
//import Op2Screen from './src/screens/Paciente/Paciente';
//import Op3Screen from './src/screens/Consulta/Consulta';
import CadastroEdicaoMedicoScreen from './src/screens/Medico/CadastroEdicaoMedicoScreen';
import { listarMedicos } from './src/services/medicosApi';

const Stack = createStackNavigator();

function App() {
  const [medicos, setMedicos] = useState([]);
  const [carregandoMedicos, setCarregandoMedicos] = useState(true);
  const [erroMedicos, setErroMedicos] = useState(null);
  const [pacientes, setPacientes] = useState([]);
  const [consultas, setConsultas] = useState([]);

  const buscarMedicos = useCallback(async () => {
    setCarregandoMedicos(true);
    setErroMedicos(null);
    try {
      const dados = await listarMedicos();
      setMedicos(dados);
    } catch (erro) {
      setErroMedicos(erro.message);
    } finally {
      setCarregandoMedicos(false);
    }
  }, []);

  useEffect(() => {
    buscarMedicos();
  }, [buscarMedicos]);

  // Função que passa os dados de 'medicos' para a tela 'Op1'
  const MedicoList = (props) => (
    <Medico
      {...props}
      medicos={medicos}
      carregando={carregandoMedicos}
      erro={erroMedicos}
      recarregar={buscarMedicos}
    />
  );

  
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        {/* A tela de Splash é a primeira, sem cabeçalho */}
        <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false }} />
        {/* A tela Menu é o ponto de partida após o carregamento */}
        <Stack.Screen name="Menu" component={MenuScreen} options={{ title: 'Menu Principal' }} />
        
        
        <Stack.Screen name="Medicos" component={MedicoList} options={{ title: 'Médico(a)s' }} />
        {/*<Stack.Screen name="Pacientes" component={Op2Screen} options={{ title: 'Pacientes' }} />
        <Stack.Screen name="Consultas" component={Op3Screen} options={{ title: 'Consultas' }} /> */}
        <Stack.Screen name="MedicoForm" options={{ title: 'Gerenciar Médico' }}>
          {(props) => <CadastroEdicaoMedicoScreen {...props} recarregarMedicos={buscarMedicos} />}
        </Stack.Screen>
        {/* Adicionei uma tela temporária para as ações do card */}
        <Stack.Screen name="EmConstrucao" component={() => (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontSize: 24 }}>Em Construção!</Text>
            </View>
        )} options={{ title: 'Em Construção' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App; 