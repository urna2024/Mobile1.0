import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CandidatoList from './candidato/list';  // Tela de Listagem
import CandidatoForm from './candidato/form';  // Tela de Cadastro de Candidatos
import CadastroUsuario from './usuario/usuarioForm';  // Caminho correto para o arquivo de Cadastro de Usuário
import PesquisaEleitoralForm from './pesquisaEleitoral/pesquisaForm';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="candidato/list"
      screenOptions={{
        drawerStyle: {
          backgroundColor: '#192150',  
          width: 240,
        },
        drawerActiveTintColor: '#fff',  
        drawerInactiveTintColor: '#fff',  
      }}
    >
      <Drawer.Screen
        name="candidato/list"
        component={CandidatoList}
        options={{
          drawerLabel: 'Listar Candidatos',
        }}
      />
      <Drawer.Screen
        name="candidato/form"
        component={CandidatoForm}
        options={{
          drawerLabel: 'Cadastrar Candidato',
        }}
      />

      <Drawer.Screen
        name="usuario/usuarioForm"
        component={CadastroUsuario}
        options={{
          drawerLabel: 'Cadastrar Usuário',
        }}
      />

      <Drawer.Screen
        name="pesquisaEleitoral/pesquisaForm"
        component={PesquisaEleitoralForm}
        options={{
          drawerLabel: 'Pesquisa Eleitoral',
        }}
      />
    </Drawer.Navigator>
  );
}
