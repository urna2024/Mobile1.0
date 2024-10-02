import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';

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
  const params = useLocalSearchParams(); // Pegamos os parâmetros da URL
  const id = Array.isArray(params.id) ? params.id[0] : params.id; // Garantir que seja uma string única
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
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
  const router = useRouter();

  const showMessage = (type: 'success' | 'error', msg: string) => {
    setMessageType(type);
    setMessage(msg);
    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

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

  useEffect(() => {
    console.log('ID do candidato recebido:', id);

    if (id) {
      setLoading(true);
      axios
        .get(`http://ggustac-002-site1.htempurl.com/api/Candidato/${id}/dadosCompletos`)
        .then((response) => {
          console.log(`Dados completos do candidato com ID ${id}:`, response.data);
          if (response.data) {
            const candidato = response.data;
            setNomeCompleto(candidato.nomeCompleto || '');
            setNomeUrna(candidato.nomeUrna || '');
            setDataNascimento(candidato.dataNascimento?.split('T')[0] || '');
            setUf(candidato.uf || '');
            setMunicipio(candidato.municipio || '');
            setFoto(candidato.foto || '');
            setIdStatus(candidato.idStatus || 0);
            setIdPartidoPolitico(candidato.idPartidoPolitico || 0);
            setIdCargoDisputado(candidato.idCargoDisputado || 0);
          } else {
            showMessage('error', 'Candidato não encontrado.');
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error('Erro ao buscar os detalhes do candidato:', error);
          setLoading(false);
          showMessage('error', 'Erro ao buscar detalhes do candidato.');
        });
    }
  }, [id]);

  const handleDateChange = (text: string) => {
    const cleaned = text.replace(/[^0-9]/g, '');
    let formatted = cleaned;
    if (cleaned.length >= 2) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
    }
    if (cleaned.length >= 4) {
      formatted = `${formatted.slice(0, 5)}/${cleaned.slice(4, 8)}`;
    }
    setDataNascimento(formatted);
  };

  const formatDateForApi = (dateString: string) => {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}T00:00:00.000Z`;
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const clearFields = () => {
    setNomeCompleto('');
    setNomeUrna('');
    setDataNascimento('');
    setUf('');
    setMunicipio('');
    setFoto('');
    setIdStatus(0);
    setIdPartidoPolitico(0);
    setIdCargoDisputado(0);
  };

  const handleSave = () => {
    const formattedDate = formatDateForApi(dataNascimento);

    const candidato = {
      id: id ? parseInt(id, 10) : 0,
      nomeCompleto,
      nomeUrna,
      dataNascimento: formattedDate,
      uf,
      municipio,
      foto,
      idStatus: parseInt(idStatus as string, 10),
      idPartidoPolitico: parseInt(idPartidoPolitico as string, 10),
      idCargoDisputado: parseInt(idCargoDisputado as string, 10),
    };

    if (id) {
      axios
        .put(`http://ggustac-002-site1.htempurl.com/api/Candidato/${id}`, candidato)
        .then(() => {
          showMessage('success', 'Candidato atualizado com sucesso!');
          clearFields();
          router.push('/candidato/list');
        })
        .catch((error) => {
          showMessage('error', 'Erro ao atualizar candidato.');
        });
    } else {
      axios
        .post('http://ggustac-002-site1.htempurl.com/api/Candidato', candidato)
        .then(() => {
          showMessage('success', 'Candidato cadastrado com sucesso!');
          clearFields();
          router.push('/candidato/list');
        })
        .catch((error) => {
          showMessage('error', 'Erro ao cadastrar candidato.');
        });
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.title}>{id ? 'Editar Candidato' : 'Cadastro de Candidato'}</Text>

      {message && (
        <View style={[styles.messageBox, messageType === 'success' ? styles.successBox : styles.errorBox]}>
          <Text style={styles.messageText}>{message}</Text>
        </View>
      )}

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
        onChangeText={handleDateChange}
        placeholder="DD/MM/YYYY"
        keyboardType="numeric"
      />

      <Text>UF</Text>
      <Picker
        selectedValue={uf}
        onValueChange={(itemValue) => setUf(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Selecione o Estado" value="" />
        {ufOptions.map((uf) => (
          <Picker.Item key={uf.sigla} label={uf.sigla} value={uf.sigla} />
        ))}
      </Picker>

      <Text>Município</Text>
      <Picker
        selectedValue={municipio}
        onValueChange={(itemValue) => setMunicipio(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Selecione o Município" value="" />
        {municipioOptions.map((municipio) => (
          <Picker.Item key={municipio.id} label={municipio.nome} value={municipio.nome} />
        ))}
      </Picker>

      <Text>Foto (URL)</Text>
      <TextInput
        style={styles.input}
        value={foto}
        onChangeText={(text) => isValidUrl(text) ? setFoto(text) : showMessage('error', 'URL inválida')}
        placeholder="URL da Foto"
      />
      {foto && isValidUrl(foto) ? (
        <Image source={{ uri: foto }} style={styles.image} onError={() => showMessage('error', 'Erro ao carregar a imagem')} />
      ) : (
        <Text>Nenhuma imagem disponível</Text>
      )}

      <Text>Status</Text>
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

      <Text>Partido Político</Text>
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

      <Text>Cargo Disputado</Text>
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

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>{id ? "Atualizar Candidato" : "Cadastrar Candidato"}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/candidato/list')}>
          <Icon name="arrow-left" size={24} color="#007bff" />
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
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  picker: {
    height: 50,
    marginBottom: 10,
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
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
  },
  backButtonText: {
    color: '#007bff',
    fontSize: 16,
    marginLeft: 10,
  },
  messageBox: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  successBox: {
    backgroundColor: '#d4edda',
    borderColor: '#c3e6cb',
  },
  errorBox: {
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
  },
  messageText: {
    color: '#155724',
    fontSize: 16,
    textAlign: 'center',
  },
});
