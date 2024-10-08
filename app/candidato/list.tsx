import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, Image, KeyboardAvoidingView, Platform } from 'react-native';
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
      return;
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
      fetchCandidatos();
    } catch (error) {
      console.error('Erro ao alterar status do candidato:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao alterar o status do candidato.');
    }
  };

  const renderCandidato = ({ item }: { item: Candidato }) => (
    <View style={styles.candidatoContainer}>
      <TouchableOpacity onPress={() => {
        router.push(`/candidato/form?id=${item.id}`);
      }}>
        <View style={styles.candidatoInfo}>
          <Text style={styles.candidatoName}>Nome Completo: {item.nomeCompleto}</Text>
          <Text>Nome Urna: {item.nomeUrna}</Text>
          <Text>UF: {item.uf}</Text>
          <Text>Município: {item.municipio}</Text>
        </View>
      </TouchableOpacity>

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
      </View>
    </View>
  );

  function navigateToDetalhe(id: number) {
    router.push({
      pathname: '/candidato/form',
      params: { id },
    });
  }
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Image source={require('../../assets/images/logo.jpeg')} style={styles.logo} />
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
            onPress={() => router.push('./form')}
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
