import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function CandidatoForm() {
  const { id } = useLocalSearchParams(); // Usando useLocalSearchParams para pegar os parâmetros
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (id) {
      setLoading(true);
      axios.get(`http://ggustac-002-site1.htempurl.com/api/Candidato/${id}/dadosCompletos`)
        .then(response => {
          const candidato = response.data;
          setNomeCompleto(candidato.nomeCompleto);
          setLoading(false);
        })
        .catch(error => {
          console.error('Erro ao buscar detalhes do candidato:', error);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{id ? 'Detalhes do Candidato' : 'Cadastro de Candidato'}</Text>
      <TextInput style={styles.input} value={nomeCompleto} onChangeText={setNomeCompleto} placeholder="Nome Completo" />
      <Button title="Voltar" onPress={() => router.back()} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
});
