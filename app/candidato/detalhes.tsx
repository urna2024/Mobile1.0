import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router'; // Hook correto para capturar parâmetros da URL

interface Candidato {
  id: number;
  nomeCompleto: string;
  nomeUrna: string;
  uf: string;
  municipio: string;
  dataNascimento: string;
  idStatus: number;
  statusNome: string;
}

export default function CandidatoDetalhes() {
  const [candidato, setCandidato] = useState<Candidato | null>(null);
  const [loading, setLoading] = useState(true);
  const { id } = useLocalSearchParams(); // Captura o parâmetro 'id' da URL

  useEffect(() => {
    const fetchCandidato = async () => {
      try {
        const response = await axios.get(`http://ggustac-002-site1.htempurl.com/api/Candidato/${id}/dadosCompletos`);
        setCandidato(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar detalhes do candidato:', error);
        setLoading(false);
      }
    };

    if (id) {
      fetchCandidato();
    }
  }, [id]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!candidato) {
    return <Text>Erro ao carregar os detalhes do candidato.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalhes do Candidato</Text>
      <Text>Nome Completo: {candidato.nomeCompleto}</Text>
      <Text>Nome Urna: {candidato.nomeUrna}</Text>
      <Text>UF: {candidato.uf}</Text>
      <Text>Município: {candidato.municipio}</Text>
      <Text>Data de Nascimento: {candidato.dataNascimento}</Text>
      <Text>Status: {candidato.statusNome}</Text>
    </View>
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
    marginBottom: 10,
  },
});
