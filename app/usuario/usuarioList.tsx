import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

interface Usuario {
  id: number;
  nomeUsuario: string;
  email: string;
  idStatus: number;
  statusNome: string;
  idPerfilUsuario: number;
  perfilNome: string;
}

export default function UsuarioList() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://ggustac-002-site1.htempurl.com/api/Usuario/dadosBasicos');
      setUsuarios(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUsuarios();
    }, [])
  );

  const renderUsuario = ({ item }: { item: Usuario }) => (
    <View style={styles.usuarioContainer}>
      <TouchableOpacity onPress={() => router.push(`/usuario/usuarioForm?id=${item.id}`)}>
        <View style={styles.usuarioInfo}>
          <Text style={styles.usuarioName}>Nome de Usuário: {item.nomeUsuario}</Text>
          <Text>Email: {item.email}</Text>
          
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Lista de Usuários</Text>

        {/* Botão para cadastrar novo candidato */}
        <TouchableOpacity style={styles.newButton} onPress={() => router.push('/usuario/usuarioForm')}>
          <Text style={styles.newButtonText}>Cadastrar Novo Usuário</Text>
        </TouchableOpacity>

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <FlatList
            data={usuarios}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderUsuario}
            contentContainerStyle={{ paddingBottom: 50 }}
          />
        )}

        <View style={styles.footer}>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  newButton: {
    padding: 10, 
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
    backgroundColor: '#1a2b52',
  },
  newButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  usuarioContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  usuarioInfo: {
    marginBottom: 10,
  },
  usuarioName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#1a2b52',
    padding: 15,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
    justifyContent: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerButton: {
    backgroundColor: '#1a2b52',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
