import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Modal, Button, Platform } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import FlashMessage, { showMessage } from 'react-native-flash-message';
import { useRouter, useLocalSearchParams } from 'expo-router';

interface Status {
  id: number;
  nome: string;
}

interface PerfilUsuario {
  id: number;
  nome: string;
}

export default function CadastroUsuario() {
  const [nomeUsuario, setNomeUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [idStatus, setIdStatus] = useState<number>(0);
  const [idPerfilUsuario, setIdPerfilUsuario] = useState<number>(0);
  const [precisaTrocarSenha, setPrecisaTrocarSenha] = useState(true);
  const [statusOptions, setStatusOptions] = useState<Status[]>([]);
  const [perfilOptions, setPerfilOptions] = useState<PerfilUsuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [cadastrando, setCadastrando] = useState(false);
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = params?.id ? String(params.id) : null;  // Capturando o ID do usuário, se houver

  useEffect(() => {
    console.log("ID capturado:", id);  // Verificar se o ID está sendo capturado corretamente
  }, [id]);

  const fetchOptions = async () => {
    try {
      const statusResponse = await axios.get('http://ggustac-002-site1.htempurl.com/api/Candidato/tipoStatus');
      setStatusOptions(statusResponse.data);

      const perfilResponse = await axios.get('http://ggustac-002-site1.htempurl.com/api/Usuario/tipoPerfilUsuario');
      setPerfilOptions(perfilResponse.data);

      setLoading(false);
    } catch (error) {
      showMessage({
        message: 'Erro',
        description: 'Ocorreu um erro ao carregar as opções.',
        type: 'danger',
      });
      setLoading(false);
    }
  };

  const fetchUsuario = async (usuarioId: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://ggustac-002-site1.htempurl.com/api/Usuario/${usuarioId}/dadosCompletos`);
      const usuario = response.data;

      console.log("Dados do usuário:", usuario);  // Verificar os dados retornados

      // Preenchendo os campos do formulário com os dados do usuário
      setNomeUsuario(usuario.nomeUsuario || '');
      setEmail(usuario.email || '');
      setIdStatus(usuario.idStatus || 0);
      setIdPerfilUsuario(usuario.idPerfilUsuario || 0);
      setPrecisaTrocarSenha(usuario.precisaTrocarSenha);

      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar os dados do usuário:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOptions();
    if (id) {
      // Se o ID estiver presente, buscar os dados do usuário para edição
      fetchUsuario(id);
    }
  }, [id]);

  const handleCadastro = async () => {
    setCadastrando(true);
    const dadosUsuario = {
      nomeUsuario,
      email,
      senha,
      idStatus,
      idPerfilUsuario,
      precisaTrocarSenha,
    };

    try {
      if (id) {
        // Atualizar o usuário existente
        await axios.put(`http://ggustac-002-site1.htempurl.com/api/Usuario/${id}`, dadosUsuario);
        showMessage({
          message: 'Sucesso',
          description: 'Usuário atualizado com sucesso!',
          type: 'success',
          icon: 'success',
          duration: 3000,
        });
      } else {
        // Criar um novo usuário
        await axios.post('http://ggustac-002-site1.htempurl.com/api/Usuario', dadosUsuario);
        showMessage({
          message: 'Sucesso',
          description: 'Usuário cadastrado com sucesso!',
          type: 'success',
          icon: 'success',
          duration: 3000,
        });

        // Resetar os campos
        setNomeUsuario('');
        setEmail('');
        setSenha('');
        setIdStatus(0);
        setIdPerfilUsuario(0);
        setPrecisaTrocarSenha(true);
      }
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
      showMessage({
        message: 'Erro',
        description: 'Ocorreu um erro ao salvar o usuário.',
        type: 'danger',
        icon: 'danger',
        duration: 3000,
      });
    } finally {
      setCadastrando(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{id ? 'Editar Usuário' : 'Cadastro de Usuário'}</Text>

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

      {!id && (
        <>
          <Text>Senha</Text>
          <TextInput
            style={styles.input}
            value={senha}
            onChangeText={setSenha}
            placeholder="Digite a senha"
            secureTextEntry={true}
          />
        </>
      )}

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

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleCadastro} disabled={cadastrando}>
          <Text style={styles.buttonText}>{cadastrando ? 'Salvando...' : id ? 'Salvar Alterações' : 'Cadastrar Usuário'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/usuario/usuarioList')}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>

      <FlashMessage position="top" />
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
  pickerButton: {
    height: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#1a2b52',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#1a2b52',
    padding: 10,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
});