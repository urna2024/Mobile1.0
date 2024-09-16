import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

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

interface Status {
  id: number;
  nome: string;
}

export default function CandidatoList() {
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const [statusOptions, setStatusOptions] = useState<Status[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  // Função para carregar a lista de candidatos
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

  // Função para carregar as opções de status
  const fetchStatusOptions = async () => {
    try {
      const response = await axios.get('http://ggustac-002-site1.htempurl.com/api/Candidato/tipoStatus');
      setStatusOptions(response.data);
    } catch (error) {
      console.error('Erro ao buscar status:', error);
    }
  };

  // Recarregar a lista quando a tela de listagem for focada
  useFocusEffect(
    useCallback(() => {
      fetchCandidatos();
      fetchStatusOptions();
    }, [])
  );

  // Função para alterar o status do candidato
  const alterarStatus = async (id: number, newStatusId: number) => {
    try {
      await axios.patch(`http://ggustac-002-site1.htempurl.com/api/Candidato/${id}/mudarStatus`, {
        idStatus: newStatusId,
      });
      Alert.alert('Sucesso', 'Status do candidato alterado com sucesso!');
      fetchCandidatos(); // Atualizar a lista após a mudança
    } catch (error) {
      console.error('Erro ao alterar status do candidato:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao alterar o status do candidato.');
    }
  };

  const renderCandidato = ({ item }: { item: Candidato }) => (
    <View style={styles.candidatoContainer}>
      <TouchableOpacity onPress={() => router.push({ pathname: './candidato/form', params: { id: item.id } })}>
        <Text style={styles.candidatoName}>Nome Completo: {item.nomeCompleto}</Text>
        <Text>Nome Urna: {item.nomeUrna}</Text>
        <Text>UF: {item.uf}</Text>
        <Text>Município: {item.municipio}</Text>
      </TouchableOpacity>
      
      <Text>Status:</Text>
      <Picker
        selectedValue={item.idStatus}
        onValueChange={(value) => alterarStatus(item.id, value)} // Altera o status ao selecionar
        style={styles.picker}
      >
        {statusOptions.map((status) => (
          <Picker.Item key={status.id} label={status.nome} value={status.id} />
        ))}
      </Picker>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Candidatos</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <FlatList
          data={candidatos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCandidato}
        />
      )}
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
    marginBottom: 20,
    textAlign: 'center',
  },
  candidatoContainer: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  candidatoName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  picker: {
    height: 50,
    width: '100%',
  },
});
