import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome'; // Importando os ícones

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

  // Função para buscar os candidatos
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

  // Função para buscar as opções de status
  const fetchStatusOptions = async () => {
    try {
      const response = await axios.get('http://ggustac-002-site1.htempurl.com/api/Candidato/tipoStatus');
      setStatusOptions(response.data);
    } catch (error) {
      console.error('Erro ao buscar status:', error);
    }
  };

  // Recarregar a lista de candidatos e status sempre que a tela ganhar foco
  useFocusEffect(
    useCallback(() => {
      fetchCandidatos();
      fetchStatusOptions();
    }, [])
  );

  // Função para alterar o status do candidato
  const alterarStatus = async (id: number, newStatusId: number) => {
    try {
      await axios.patch(
        `http://ggustac-002-site1.htempurl.com/api/Candidato/${id}/mudarStatus`,
        newStatusId, // Enviar apenas o valor do idStatus
        {
          headers: {
            'Content-Type': 'application/json', // Definir o tipo de conteúdo como JSON
          },
        }
      );
      Alert.alert('Sucesso', 'Status do candidato alterado com sucesso!');
      fetchCandidatos(); // Atualizar a lista após a mudança
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Erro ao alterar status do candidato:', error.response?.data);
        Alert.alert('Erro', `Ocorreu um erro ao alterar o status do candidato: ${error.response?.data}`);
      } else {
        console.error('Erro desconhecido:', error);
        Alert.alert('Erro', 'Ocorreu um erro desconhecido ao alterar o status do candidato.');
      }
    }
  };

  const renderCandidato = ({ item }: { item: Candidato }) => (
    <View style={styles.candidatoContainer}>
      <TouchableOpacity onPress={() => router.push({ pathname: '/candidato/form', params: { id: item.id } })}>
        <Text style={styles.candidatoName}>Nome Completo: {item.nomeCompleto}</Text>
        <Text>Nome Urna: {item.nomeUrna}</Text>
        <Text>UF: {item.uf}</Text>
        <Text>Município: {item.municipio}</Text>
      </TouchableOpacity>

      <View style={styles.actionContainer}>
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

        {/* Ícone de "olho" para visualizar/editar o candidato */}
        <TouchableOpacity onPress={() => router.push({ pathname: '/candidato/form', params: { id: item.id } })}>
          <Icon name="eye" size={24} color="#007bff" style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Candidatos</Text>
      
      {/* Botão para cadastrar novo candidato */}
      <TouchableOpacity style={styles.newButton} onPress={() => router.push('/candidato/form')}>
        <Text style={styles.newButtonText}>Cadastrar Novo Candidato</Text>
      </TouchableOpacity>

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
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  picker: {
    height: 50,
    width: '70%',
  },
  icon: {
    marginLeft: 10,
  },
  newButton: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
    backgroundColor: '#1a2b52',
  },
  newButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
