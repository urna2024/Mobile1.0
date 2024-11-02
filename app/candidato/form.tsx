import React, { useState, useEffect,useCallback } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, ActivityIndicator, Alert, Image } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { TouchableOpacity,   } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

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
  const { id } = useLocalSearchParams();
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

  useEffect(() => {
    
    console.log("id = " + id);
    axios.get<Status[]>('http://ggustac-002-site1.htempurl.com/api/Candidato/tipoStatus')
      .then(response => setStatusOptions(response.data))
      .catch(error => console.error('Erro ao carregar status:', error));

    axios.get<PartidoPolitico[]>('http://ggustac-002-site1.htempurl.com/api/Candidato/tipoPartidoPolitico')
      .then(response => setPartidoOptions(response.data))
      .catch(error => console.error('Erro ao carregar partidos:', error));

    axios.get<CargoDisputado[]>('http://ggustac-002-site1.htempurl.com/api/Candidato/tipoCargoDisputado')
      .then(response => setCargoOptions(response.data))
      .catch(error => console.error('Erro ao carregar cargos:', error));

    
    axios.get<UF[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then(response => setUfOptions(response.data))
      .catch(error => console.error('Erro ao carregar estados:', error));
  }, []);

  
  useEffect(() => {
    if (uf) {
      axios.get<Municipio[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`)
        .then(response => setMunicipioOptions(response.data))
        .catch(error => console.error('Erro ao carregar municípios:', error));
    }
  }, [uf]);

  
  
  useFocusEffect(
    useCallback(() => {
      if (id) {
        setLoading(true);
        axios.get(`http://ggustac-002-site1.htempurl.com/api/Candidato/${id}/dadosCompletos`)
          .then(response => {
            const candidato = response.data;
            setNomeCompleto(candidato.nomeCompleto);
            setNomeUrna(candidato.nomeUrna);
            setDataNascimento(formatDateForDisplay(candidato.dataNascimento));
            setUf(candidato.uf);
            setMunicipio(candidato.municipio);
            setFoto(candidato.foto);
            setIdStatus(candidato.idStatus);
            setIdPartidoPolitico(candidato.idPartidoPolitico);
            setIdCargoDisputado(candidato.idCargoDisputado);
            setLoading(false);
          })
          .catch(error => {
            console.error('Erro ao buscar detalhes do candidato:', error);
            setLoading(false);
          });
      }
    }, [id])
  );
  

  
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

  
  const formatDateForDisplay = (dateString: string) => {
    const [year, month, day] = dateString.split('T')[0].split('-');
    return `${day}/${month}/${year}`;
  };

 
  const formatDateForApi = (dateString: string) => {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}T00:00:00.000Z`;
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
      id: id ? parseInt(id as string, 10) : 0,
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

    console.log('Dados do candidato a serem enviados:', candidato);

    if (id) {
      axios.put(`http://ggustac-002-site1.htempurl.com/api/Candidato/${id}`, candidato)
        .then(() => {
          Alert.alert('Sucesso', 'Candidato atualizado com sucesso!');
          clearFields();
          router.push('/candidato/list'); 
        })
        .catch(error => {
          console.error('Erro ao atualizar candidato (detalhes):', error.response?.data);
          Alert.alert('Erro', `Ocorreu um erro ao atualizar o candidato: ${JSON.stringify(error.response?.data)}`);
        });
    } else {
      axios.post('http://ggustac-002-site1.htempurl.com/api/Candidato', candidato)
        .then(() => {
          Alert.alert('Sucesso', 'Candidato cadastrado com sucesso!');
          clearFields();
          router.push('/candidato/list'); 
        })
        .catch(error => {
          console.error('Erro ao cadastrar candidato (detalhes):', error.response?.data);
          Alert.alert('Erro', `Ocorreu um erro ao cadastrar o candidato: ${JSON.stringify(error.response?.data)}`);
        });
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ScrollView style={styles.container}>
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
        onChangeText={handleDateChange}
        placeholder="DD/MM/YYYY"
        keyboardType="numeric"
      />
  
      <Text>UF</Text>
      <View style={styles.pickerContainer}>
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
      </View>
  
      <Text>Município</Text>
      <View style={styles.pickerContainer}>
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
      </View>
  
      <Text>Foto (URL)</Text>
      <TextInput
        style={styles.input}
        value={foto}
        onChangeText={setFoto}
        placeholder="URL da Foto"
      />
      {foto ? <Image source={{ uri: foto }} style={styles.image} /> : null}
  
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
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', 
    
  },
  button: {
    backgroundColor: '#1a2b52', 
    padding: 15,
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
    padding: 15,
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    marginBottom: 15,
  },
  picker: {
    height: 50,
    width: '100%',  // Ajusta a largura para 100%
  },
  image: {
    width: '100%',
    height: 200,
    marginTop: 10,
    borderRadius: 8,
  },
});
