import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CandidatoList from './candidato/list';  // Tela de Listagem
import CandidatoForm from './candidato/form';  // Tela de Cadastro de Candidatos
import CadastroUsuario from './usuario/usuarioForm';  // Caminho correto para o arquivo de Cadastro de Usuário

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="candidato/list"
      screenOptions={{
        drawerStyle: {
          backgroundColor: '#192150',  // Cor de fundo do Drawer
          width: 240,
        },
        drawerActiveTintColor: '#fff',  // Cor do texto ativo
        drawerInactiveTintColor: '#fff',  // Cor do texto inativo
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
      {/* Corrigido o caminho da tela de Cadastro de Usuário */}
      <Drawer.Screen
        name="usuario/usuarioForm"  // Nome da rota corrigido
        component={CadastroUsuario}
        options={{
          drawerLabel: 'Cadastrar Usuário',
        }}
      />
    </Drawer.Navigator>
  );
}
