import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';

interface Status {
  id: number;
  nome: string;
}

interface PerfilUsuario {
  id: number;
  nome: string;
}

export default function CadastroUsuario() {
  // Estados para armazenar os valores dos campos
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [idStatus, setIdStatus] = useState<number>(0);
  const [idPerfilUsuario, setIdPerfilUsuario] = useState<number>(0);
  const [precisaTrocarSenha, setPrecisaTrocarSenha] = useState(true);

  // Estados para armazenar as opções do select
  const [statusOptions, setStatusOptions] = useState<Status[]>([]);
  const [perfilOptions, setPerfilOptions] = useState<PerfilUsuario[]>([]);
  const [loading, setLoading] = useState(true);

  // Função para buscar opções de Status e Perfis de Usuário
  const fetchOptions = async () => {
    try {
      // Busca as opções de Status
      const statusResponse = await axios.get('http://ggustac-002-site1.htempurl.com/api/Candidato/tipoStatus');
      console.log('Status Options:', statusResponse.data);  // Verificar se os dados estão sendo recebidos corretamente
      setStatusOptions(statusResponse.data);

      // Busca as opções de Perfis de Usuário
      const perfilResponse = await axios.get('http://ggustac-002-site1.htempurl.com/api/PerfilUsuario'); // Substitua pela rota correta
      console.log('Perfil Options:', perfilResponse.data);  // Verificar se os dados estão sendo recebidos corretamente
      setPerfilOptions(perfilResponse.data);

      setLoading(false); // Para o spinner
    } catch (error) {
      console.error('Erro ao carregar opções:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao carregar as opções.');
      setLoading(false);
    }
  };

  // UseEffect para buscar as opções assim que o componente é montado
  useEffect(() => {
    fetchOptions();
  }, []);

  // Função para cadastrar usuário
  const handleCadastro = async () => {
    // Dados a serem enviados para a API
    const dadosUsuario = {
      nomeUsuario,
      email,
      senha,
      idStatus: idStatus,
      idPerfilUsuario: idPerfilUsuario,
      precisaTrocarSenha,
    };

    try {
      // Fazer a requisição POST para a API
      const response = await axios.post('http://ggustac-002-site1.htempurl.com/api/Usuario', dadosUsuario);
      
      // Sucesso
      Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!');
      
      // Limpar campos após o cadastro
      setNomeUsuario('');
      setEmail('');
      setSenha('');
      setIdStatus(0);
      setIdPerfilUsuario(0);
      setPrecisaTrocarSenha(true);
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao cadastrar o usuário.');
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Cadastro de Usuário</Text>
      
      <Text>Nome de Usuário</Text>
      <TextInput
        style={styles.input}
        value={nomeUsuario}
        onChangeText={setNomeUsuario}
        placeholder="Digite o nome de usuário"
      />

      <Text>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Digite o email"
        keyboardType="email-address"
      />

      <Text>Senha</Text>
      <TextInput
        style={styles.input}
        value={senha}
        onChangeText={setSenha}
        placeholder="Digite a senha"
        secureTextEntry={true}
      />

      <Text>Status</Text>
      <Picker
        selectedValue={idStatus}
        onValueChange={(itemValue: number) => setIdStatus(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Selecione o Status" value={0} />
        {statusOptions.map((status) => (
          <Picker.Item key={status.id} label={status.nome} value={status.id} />
        ))}
      </Picker>

      <Text>Perfil de Usuário</Text>
      <Picker
        selectedValue={idPerfilUsuario}
        onValueChange={(itemValue: number) => setIdPerfilUsuario(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Selecione o Perfil de Usuário" value={0} />
        {perfilOptions.map((perfil) => (
          <Picker.Item key={perfil.id} label={perfil.nome} value={perfil.id} />
        ))}
      </Picker>

      <Button title="Cadastrar Usuário" onPress={handleCadastro} />
    </ScrollView>
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
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
    marginBottom: 10,
  },
});
