import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome'; 
import PrincipalScreen from './principal/principal';
import CandidatoListScreen from './candidato/list';
import PesquisaEleitoralFormScreen from './pesquisaEleitoral/pesquisaForm';
import UsuarioListScreen from './usuario/usuarioList';
import LoginScreen from './login/login1';

const Tab = createBottomTabNavigator();

export default function Layout() {
  return (
    <Tab.Navigator screenOptions={{
      headerStyle: { backgroundColor: '#1a2b52' }, 
      headerTintColor: '#FFFFFF', 
      headerTitle: 'MapeiaVoto', 
      headerTitleAlign: 'center', 
    }}>
      <Tab.Screen 
        name="principal/principal" 
        component={PrincipalScreen} 
        options={{ 
          tabBarLabel: 'Principal', 
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
        }} 
      />
      <Tab.Screen 
        name="candidato/list" 
        component={CandidatoListScreen} 
        options={{ 
          tabBarLabel: 'Candidatos', 
          tabBarIcon: ({ color, size }) => (
            <Icon name="users" color={color} size={size} />
          ),
        }} 
      />
      <Tab.Screen 
        name="pesquisaEleitoral/pesquisaForm" 
        component={PesquisaEleitoralFormScreen} 
        options={{ 
          tabBarLabel: 'Pesquisa', 
          tabBarIcon: ({ color, size }) => (
            <Icon name="search" color={color} size={size} />
          ),
        }} 
      />
      <Tab.Screen 
        name="usuario/usuarioList" 
        component={UsuarioListScreen} 
        options={{ 
          tabBarLabel: 'Usuários', 
          tabBarIcon: ({ color, size }) => (
            <Icon name="user" color={color} size={size} />
          ),
        }} 
      />
      <Tab.Screen 
        name="login/login1" 
        component={LoginScreen} 
        options={{ 
          tabBarLabel: 'Login', 
          tabBarIcon: ({ color, size }) => (
            <Icon name="user" color={color} size={size} />
          ),
        }} 
      />
    </Tab.Navigator>
  );
}
