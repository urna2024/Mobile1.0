import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Image, KeyboardAvoidingView, Platform } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

interface Candidato {
  id: number;
  nomeCompleto: string;
  nomeUrna: string;
  uf: string;
  municipio: string;
}

export default function CandidatoList() {
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const fetchCandidatos = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://ggustac-002-site1.htempurl.com/api/Candidato/dadosBasicos');
      setCandidatos(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar candidatos:', error);
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCandidatos();
    }, [])
  );

  const renderCandidato = ({ item }: { item: Candidato }) => (
    <View style={styles.candidatoContainer}>
      <TouchableOpacity onPress={() => router.push(`/candidato/form?id=${item.id}`)}>
        <View style={styles.candidatoInfo}>
          <Text style={styles.candidatoName}>Nome Completo: {item.nomeCompleto}</Text>
          <Text>Nome Urna: {item.nomeUrna}</Text>
          <Text>UF: {item.uf}</Text>
          <Text>Município: {item.municipio}</Text>
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
        <View style={styles.header}>
          
          <Text style={styles.title}>Lista de Candidatos</Text>
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <FlatList
            data={candidatos}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderCandidato}
            contentContainerStyle={{ paddingBottom: 50 }}
          />
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.backButton]}
            onPress={() => router.push('/')}
          >
            <Text style={styles.buttonText}>Voltar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/candidato/form')}
          >
            <Text style={styles.buttonText}>Adicionar Candidato</Text>
          </TouchableOpacity>
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
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 50,
    height: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  candidatoContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  candidatoInfo: {
    marginBottom: 10,
  },
  candidatoName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
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
  backButton: {
    backgroundColor: '#1a2b52',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    justifyContent: 'center',
  },
});
