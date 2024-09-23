import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/FontAwesome'; // Ícones para visualização

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

  const fetchStatusOptions = async () => {
    try {
      const response = await axios.get('http://ggustac-002-site1.htempurl.com/api/Candidato/tipoStatus');
      setStatusOptions(response.data);
    } catch (error) {
      console.error('Erro ao buscar status:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCandidatos();
      fetchStatusOptions();
    }, [])
  );

  const alterarStatus = async (id: number, newStatusId: number) => {
    const candidatoAtual = candidatos.find((candidato) => candidato.id === id);

    if (!candidatoAtual || candidatoAtual.idStatus === newStatusId) {
      return; // Não fazer nada se o status não mudou
    }

    try {
      await axios.patch(
        `http://ggustac-002-site1.htempurl.com/api/Candidato/${id}/mudarStatus`,
        JSON.stringify(newStatusId),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      Alert.alert('Sucesso', 'Status do candidato alterado com sucesso!');
      fetchCandidatos(); // Atualiza a lista após a mudança
    } catch (error) {
      console.error('Erro ao alterar status do candidato:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao alterar o status do candidato.');
    }
  };

  const renderCandidato = ({ item }: { item: Candidato }) => (
    <View style={styles.candidatoContainer}>
      <View style={styles.candidatoInfo}>
        <TouchableOpacity onPress={() => router.push({ pathname: './form', params: { id: item.id } })}>
          <Text style={styles.candidatoName}>Nome Completo: {item.nomeCompleto}</Text>
          <Text>Nome Urna: {item.nomeUrna}</Text>
          <Text>UF: {item.uf}</Text>
          <Text>Município: {item.municipio}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.actionContainer}>
        <Text>Status:</Text>
        <Picker
          selectedValue={item.idStatus}
          onValueChange={(value) => alterarStatus(item.id, value)}
          style={styles.picker}
        >
          {statusOptions.map((status) => (
            <Picker.Item key={status.id} label={status.nome} value={status.id} />
          ))}
        </Picker>

        <TouchableOpacity onPress={() => router.push({ pathname: './form', params: { id: item.id } })}>
          <Icon name="eye" size={24} color="#007bff" style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Candidatos</Text>

      {/* Botão de Cadastrar Candidato */}
      <TouchableOpacity
        style={styles.cadastrarButton}
        onPress={() => router.push('./form')}  // Redireciona para o formulário de cadastro
      >
        <Text style={styles.cadastrarButtonText}>Cadastrar Candidato</Text>
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
  cadastrarButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
  },
  cadastrarButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  picker: {
    height: 40,
    width: '50%',
  },
  icon: {
    marginLeft: 10,
  },
});
