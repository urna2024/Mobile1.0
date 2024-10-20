import React, { useState } from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerContentComponentProps } from '@react-navigation/drawer';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActionSheetIOS } from 'react-native';
import CandidatoList from './candidato/list';
import CandidatoForm from './candidato/form';
import CadastroUsuario from './usuario/usuarioForm';
import PesquisaEleitoralForm from './pesquisaEleitoral/pesquisaForm';
import LoginScreen from './login/login1';
import UsuarioList from './usuario/usuarioList';
import { useNavigation } from '@react-navigation/native';



const Drawer = createDrawerNavigator();

// Função para extrair as iniciais do nome do usuário
const getInitials = (name: string) => {
  const initials = name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .toUpperCase();
  return initials.length > 2 ? initials.slice(0, 2) : initials;  // Pegar até duas iniciais
};

function CustomDrawerContent(props: DrawerContentComponentProps) {
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.header}>
        <Text style={styles.appName}>MapeiaVoto</Text>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}

export default function DrawerNavigator() {
  const usuarioNome = "André Cavichiolli";  // Exemplo: nome do usuário
  const iniciaisUsuario = getInitials(usuarioNome);
  const navigation = useNavigation();

  // Função para mostrar o ActionSheet com opções
  const showUserOptions = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Cancelar', 'Alterar Dados do Usuário', 'Sair'],  // Tipagem correta aqui
        destructiveButtonIndex: 2,  // Índice da opção "Sair"
        cancelButtonIndex: 0,
      },
      (buttonIndex: number) => {  // Adicione explicitamente a tipagem number aqui
        if (buttonIndex === 1) {
          // Navegar para o formulário de alteração de dados do usuário
         // navigation.navigate('usuario/usuarioForm');
        } else if (buttonIndex === 2) {
          // Realizar o logout e redirecionar para a tela de login
          Alert.alert('Você saiu do aplicativo!');
         // navigation.navigate('login/login1');
        }
      }
    );
  };

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
        headerStyle: {
          backgroundColor: '#1a2b52',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 20,
          alignSelf: 'center',
        },
        headerTitleAlign: 'center',
        headerRight: () => (
          <TouchableOpacity style={styles.userCircle} onPress={showUserOptions}>
            <Text style={styles.initials}>{iniciaisUsuario}</Text>
          </TouchableOpacity>
        ),
      }}
    >
      <Drawer.Screen
        name="candidato/list"
        component={CandidatoList}
        options={{
          drawerLabel: 'Listar Candidatos',
          title: 'MapeiaVoto',
        }}
      />
      <Drawer.Screen
        name="candidato/form"
        component={CandidatoForm}
        options={{
          drawerLabel: 'Cadastrar Candidato',
          title: 'MapeiaVoto',
        }}
      />
      <Drawer.Screen
        name="usuario/usuarioForm"
        component={CadastroUsuario}
        options={{
          drawerLabel: 'Cadastrar Usuário',
          title: 'MapeiaVoto',
        }}
      />
      <Drawer.Screen
        name="usuario/usuarioList"
        component={UsuarioList}
        options={{
          drawerLabel: 'Listar Usuário',
          title: 'MapeiaVoto',
        }}
      />
      <Drawer.Screen
        name="pesquisaEleitoral/pesquisaForm"
        component={PesquisaEleitoralForm}
        options={{
          drawerLabel: 'Pesquisa Eleitoral',
          title: 'MapeiaVoto',
        }}
      />
      <Drawer.Screen
        name="login/login1"
        component={LoginScreen}
        options={{
          drawerLabel: 'Login',
          title: 'MapeiaVoto',
        }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 150,
    backgroundColor: '#192150',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  appName: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  userCircle: {
    backgroundColor: '#fff',
    width: 30,
    height: 30,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,  
  },
  initials: {
    color: '#1a2b52',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
