import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, ActivityIndicator, Image, TouchableOpacity, Alert, Platform } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { showMessage } from 'react-native-flash-message';

interface Status {
  id: number;
  nome: string;
}

interface PartidoPolitico {
  id: number;
  nome: string;
}

interface CargoDisputado {
  id: number;
  nome: string;
}

interface UF {
  id: number;
  sigla: string;
  nome: string;
}

interface Municipio {
  id: number;
  nome: string;
}

export default function CandidatoForm() {
  const params = useLocalSearchParams();
  const id = params?.id ? String(params.id) : null;  // Capturando o ID do candidato, se houver

  const [nomeCompleto, setNomeCompleto] = useState('');
  const [nomeUrna, setNomeUrna] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [uf, setUf] = useState('');
  const [municipio, setMunicipio] = useState('');
  const [foto, setFoto] = useState('');
  const [idStatus, setIdStatus] = useState<number | string>(0);
  const [idPartidoPolitico, setIdPartidoPolitico] = useState<number | string>(0);
  const [idCargoDisputado, setIdCargoDisputado] = useState<number | string>(0);

  const [statusOptions, setStatusOptions] = useState<Status[]>([]);
  const [partidoOptions, setPartidoOptions] = useState<PartidoPolitico[]>([]);
  const [cargoOptions, setCargoOptions] = useState<CargoDisputado[]>([]);
  const [ufOptions, setUfOptions] = useState<UF[]>([]);
  const [municipioOptions, setMunicipioOptions] = useState<Municipio[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  // Carregar opções de status, partidos, cargos, estados e municípios
  useEffect(() => {
    axios
      .get<Status[]>('http://ggustac-002-site1.htempurl.com/api/Candidato/tipoStatus')
      .then((response) => setStatusOptions(response.data))
      .catch((error) => console.error('Erro ao carregar status:', error));

    axios
      .get<PartidoPolitico[]>('http://ggustac-002-site1.htempurl.com/api/Candidato/tipoPartidoPolitico')
      .then((response) => setPartidoOptions(response.data))
      .catch((error) => console.error('Erro ao carregar partidos:', error));

    axios
      .get<CargoDisputado[]>('http://ggustac-002-site1.htempurl.com/api/Candidato/tipoCargoDisputado')
      .then((response) => setCargoOptions(response.data))
      .catch((error) => console.error('Erro ao carregar cargos:', error));

    axios
      .get<UF[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then((response) => setUfOptions(response.data))
      .catch((error) => console.error('Erro ao carregar estados:', error));
  }, []);

  useEffect(() => {
    if (uf) {
      axios
        .get<Municipio[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`)
        .then((response) => setMunicipioOptions(response.data))
        .catch((error) => console.error('Erro ao carregar municípios:', error));
    }
  }, [uf]);

  // Validação de URL da foto
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const validateFields = () => {
    if (!nomeCompleto || !nomeUrna || !dataNascimento || !uf || !municipio || !idStatus || !idPartidoPolitico || !idCargoDisputado) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios!');
      return false;
    }

    if (foto && !isValidUrl(foto)) {
      Alert.alert('Erro', 'A URL da foto é inválida.');
      return false;
    }

    return true;
  };

  const handleSave = () => {
    if (!validateFields()) {
      return;
    }

    const candidato = {
      nomeCompleto,
      nomeUrna,
      dataNascimento,
      uf,
      municipio,
      foto,
      idStatus: parseInt(idStatus as string, 10),
      idPartidoPolitico: parseInt(idPartidoPolitico as string, 10),
      idCargoDisputado: parseInt(idCargoDisputado as string, 10),
    };

    setLoading(true);
    if (id) {
      axios
        .put(`http://ggustac-002-site1.htempurl.com/api/Candidato/${id}`, candidato)
        .then(() => {
          Alert.alert('Sucesso', 'Candidato atualizado com sucesso!');
          router.push('/candidato/list');
        })
        .catch((error) => {
          console.error('Erro ao atualizar candidato:', error);
          Alert.alert('Erro', 'Erro ao atualizar candidato.');
        })
        .finally(() => setLoading(false));
    } else {
      axios
        .post('http://ggustac-002-site1.htempurl.com/api/Candidato', candidato)
        .then(() => {
          Alert.alert('Sucesso', 'Candidato cadastrado com sucesso!');
          router.push('/candidato/list');
        })
        .catch((error) => {
          console.error('Erro ao cadastrar candidato:', error);
          Alert.alert('Erro', 'Erro ao cadastrar candidato.');
        })
        .finally(() => setLoading(false));
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.title}>{id ? 'Editar Candidato' : 'Cadastro de Candidato'}</Text>

      <Text>Nome Completo</Text>
      <TextInput
        style={styles.input}
        value={nomeCompleto}
        onChangeText={setNomeCompleto}
        placeholder="Nome Completo"
      />

      <Text>Nome na Urna</Text>
      <TextInput
        style={styles.input}
        value={nomeUrna}
        onChangeText={setNomeUrna}
        placeholder="Nome na Urna"
      />

      <Text>Data de Nascimento</Text>
      <TextInput
        style={styles.input}
        value={dataNascimento}
        onChangeText={setDataNascimento}
        placeholder="DD/MM/YYYY"
        keyboardType="numeric"
      />

      <Text>UF</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={uf}
          onValueChange={setUf}
          style={styles.picker}
        >
          <Picker.Item label="Selecione o Estado" value="" />
          {ufOptions.map((uf) => (
            <Picker.Item key={uf.sigla} label={uf.sigla} value={uf.sigla} />
          ))}
        </Picker>
      </View>

      <Text>Município</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={municipio}
          onValueChange={setMunicipio}
          style={styles.picker}
        >
          <Picker.Item label="Selecione o Município" value="" />
          {municipioOptions.map((municipio) => (
            <Picker.Item key={municipio.id} label={municipio.nome} value={municipio.nome} />
          ))}
        </Picker>
      </View>

      <Text>Foto (URL)</Text>
      <TextInput
        style={styles.input}
        value={foto}
        onChangeText={(text) => setFoto(text)}
        placeholder="URL da Foto"
      />
      {foto && isValidUrl(foto) ? (
        <Image source={{ uri: foto }} style={styles.image} />
      ) : (
        <Text>Nenhuma imagem disponível</Text>
      )}

      <Text>Status</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={idStatus}
          onValueChange={(itemValue) => setIdStatus(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Selecione o Status" value={0} />
          {statusOptions.map((status) => (
            <Picker.Item key={status.id} label={status.nome} value={status.id} />
          ))}
        </Picker>
      </View>

      <Text>Partido Político</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={idPartidoPolitico}
          onValueChange={(itemValue) => setIdPartidoPolitico(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Selecione o Partido Político" value={0} />
          {partidoOptions.map((partido) => (
            <Picker.Item key={partido.id} label={partido.nome} value={partido.id} />
          ))}
        </Picker>
      </View>

      <Text>Cargo Disputado</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={idCargoDisputado}
          onValueChange={(itemValue) => setIdCargoDisputado(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Selecione o Cargo" value={0} />
          {cargoOptions.map((cargo) => (
            <Picker.Item key={cargo.id} label={cargo.nome} value={cargo.id} />
          ))}
        </Picker>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>{id ? 'Atualizar Candidato' : 'Cadastrar Candidato'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/candidato/list')}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center', 
    alignSelf: 'center',  
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
  },
  picker: {
    height: 50,
  },
  image: {
    width: '100%',
    height: 200,
    marginTop: 10,
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
});
