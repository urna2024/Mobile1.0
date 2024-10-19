import React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerContentComponentProps } from '@react-navigation/drawer';
import { View, Text, Image, StyleSheet } from 'react-native';
import CandidatoList from './candidato/list';
import CandidatoForm from './candidato/form';
import CadastroUsuario from './usuario/usuarioForm';
import PesquisaEleitoralForm from './pesquisaEleitoral/pesquisaForm';
import LoginScreen from './login/login1';
import UsuarioList from './usuario/usuarioList';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props: DrawerContentComponentProps) {
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.header}>

        <Text style={styles.appName}>MapeiaVoto</Text>
      </View>
      {/* Renderiza os itens do Drawer */}
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="login/login1"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
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
        name="usuario/usuarioList"
        component={UsuarioList}
        options={{
          drawerLabel: 'Listar Usuário',
        }}
      />

      <Drawer.Screen
        name="pesquisaEleitoral/pesquisaForm"
        component={PesquisaEleitoralForm}
        options={{
          drawerLabel: 'Pesquisa Eleitoral',
        }}
      />

      <Drawer.Screen
        name="login/login1"
        component={LoginScreen}
        options={{
          drawerLabel: 'Login',
        }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 150,  // Altura do cabeçalho
    backgroundColor: '#192150',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  logo: {
    width: 80,  // Tamanho da logo
    height: 80,
    resizeMode: 'contain',  // Ajusta a logo para caber no espaço
  },
  appName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
});