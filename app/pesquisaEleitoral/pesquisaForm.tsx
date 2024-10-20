import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';

interface Candidato {
  id: number;
  nomeUrna: string;
}

interface UF {
  sigla: string;
  nome: string;
}

interface Municipio {
  id: number;
  nome: string;
}

export default function PesquisaEleitoralForm() {
  const [uf, setUf] = useState<string>('');
  const [municipio, setMunicipio] = useState<string>('');
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [votoIndeciso, setVotoIndeciso] = useState(false);
  const [votoBrancoNulo, setVotoBrancoNulo] = useState(false);
  const [sugestaoMelhoria, setSugestaoMelhoria] = useState('');
  const [idCandidatoPrefeito, setIdCandidatoPrefeito] = useState<number>(0);
  const [idCandidatoVereador, setIdCandidatoVereador] = useState<number>(0);
  const [entrevistadoNome, setEntrevistadoNome] = useState('');
  const [entrevistadoDataNascimento, setEntrevistadoDataNascimento] = useState('');
  const [entrevistadoCelular, setEntrevistadoCelular] = useState('');
  const [idGenero, setIdGenero] = useState<number>(0);
  const [idNivelEscolaridade, setIdNivelEscolaridade] = useState<number>(0);
  const [idRendaFamiliar, setIdRendaFamiliar] = useState<number>(0);

  const [ufs, setUfs] = useState<UF[]>([]);
  const [generos, setGeneros] = useState<{ id: number; nome: string }[]>([]);
  const [escolaridades, setEscolaridades] = useState<{ id: number; nome: string }[]>([]);
  const [rendas, setRendas] = useState<{ id: number; nome: string }[]>([]);
  const [candidatosPrefeito, setCandidatosPrefeito] = useState<Candidato[]>([]);
  const [candidatosVereador, setCandidatosVereador] = useState<Candidato[]>([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const formatarTelefone = (telefone: string) => {
    const apenasNumeros = telefone.replace(/\D/g, '');
    if (apenasNumeros.length <= 10) {
      return apenasNumeros.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2');
    } else {
      return apenasNumeros.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2');
    }
  };

  const formatarDataParaApi = (data: string) => {
    if (!data) return null;
    const [dia, mes, ano] = data.split('/');
    if (!dia || !mes || !ano) return null;
    return `${ano}-${mes}-${dia}T00:00:00.000Z`;
  };

  useEffect(() => {
    axios.get<UF[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then(response => setUfs(response.data))
      .catch(error => console.error('Erro ao carregar estados:', error));
  }, []);

  useEffect(() => {
    if (uf) {
      axios.get<Municipio[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`)
        .then(response => setMunicipios(response.data))
        .catch(error => console.error('Erro ao carregar municípios:', error));
    }
  }, [uf]);

  useEffect(() => {
    if (uf && municipio) {
      axios.get<Candidato[]>(`http://ggustac-002-site1.htempurl.com/api/PesquisaEleitoral/prefeitos?uf=${uf}&municipio=${municipio}`)
        .then(response => setCandidatosPrefeito(response.data))
        .catch(error => console.error('Erro ao carregar candidatos a prefeito:', error));

      axios.get<Candidato[]>(`http://ggustac-002-site1.htempurl.com/api/PesquisaEleitoral/vereadores?uf=${uf}&municipio=${municipio}`)
        .then(response => setCandidatosVereador(response.data))
        .catch(error => console.error('Erro ao carregar candidatos a vereador:', error));
    }
  }, [uf, municipio]);

  useEffect(() => {
    axios.get('http://ggustac-002-site1.htempurl.com/api/PesquisaEleitoral/generos')
      .then(response => setGeneros(response.data))
      .catch(error => console.error('Erro ao carregar gêneros:', error));

    axios.get('http://ggustac-002-site1.htempurl.com/api/PesquisaEleitoral/nivelEscolaridade')
      .then(response => setEscolaridades(response.data))
      .catch(error => console.error('Erro ao carregar níveis de escolaridade:', error));

    axios.get('http://ggustac-002-site1.htempurl.com/api/PesquisaEleitoral/rendaFamiliar')
      .then(response => setRendas(response.data))
      .catch(error => console.error('Erro ao carregar rendas familiares:', error));
  }, []);

  const handleSave = () => {
    if (!uf || !municipio || !entrevistadoNome || !entrevistadoDataNascimento || !entrevistadoCelular) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
      return;
    }
  
    setLoading(true);
  
    const pesquisaData = {
      id: 0,
      dataEntrevista: new Date().toISOString(),
      uf,
      municipio,
      votoIndeciso,
      votoBrancoNulo,
      sugestaoMelhoria,
      idCandidatoPrefeito,  // Agora enviando o ID numérico
      idCandidatoVereador,  // Agora enviando o ID numérico
      idUsuario: 1,
      idStatus: 1,
      entrevistado: [
        {
          id: 0,
          nomeCompleto: entrevistadoNome,
          dataNascimento: formatarDataParaApi(entrevistadoDataNascimento),
          celular: entrevistadoCelular,
          uf,
          municipio,
          idGenero,
          idNivelEscolaridade,
          idRendaFamiliar,
        },
      ],
      request: {}  // Adicionando um campo request vazio
    };
  
    axios.post('http://ggustac-002-site1.htempurl.com/api/PesquisaEleitoral', pesquisaData)
      .then(() => {
        Alert.alert('Sucesso', 'Pesquisa eleitoral salva com sucesso!');
        router.push('/');
      })
      .catch(error => {
        console.error('Erro ao salvar pesquisa eleitoral:', error.response ? error.response.data : error);
        Alert.alert('Erro', 'Ocorreu um erro ao salvar a pesquisa eleitoral.');
      })
      .finally(() => setLoading(false));
  };
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.title}>Pesquisa Eleitoral</Text>

      <Text>Nome do Entrevistado</Text>
      <TextInput
        style={styles.input}
        value={entrevistadoNome}
        onChangeText={setEntrevistadoNome}
        placeholder="Nome Completo"
      />

      <Text>Data de Nascimento do Entrevistado</Text>
      <TextInput
        style={styles.input}
        value={entrevistadoDataNascimento}
        onChangeText={setEntrevistadoDataNascimento}
        placeholder="DD/MM/AAAA"
        keyboardType="numeric"
      />

      <Text>Celular do Entrevistado</Text>
      <TextInput
        style={styles.input}
        value={entrevistadoCelular}
        onChangeText={(text) => setEntrevistadoCelular(formatarTelefone(text))}
        placeholder="(00) 00000-0000"
        keyboardType="phone-pad"
      />

      <Text>UF</Text>
      <Picker
        selectedValue={uf}
        onValueChange={setUf}
        style={styles.picker}
      >
        <Picker.Item label="Selecione o Estado" value="" />
        {ufs.map((uf) => (
          <Picker.Item key={uf.sigla} label={uf.sigla} value={uf.sigla} />
        ))}
      </Picker>

      <Text>Município</Text>
      <Picker
        selectedValue={municipio}
        onValueChange={setMunicipio}
        style={styles.picker}
        enabled={uf !== ''}
      >
        <Picker.Item label="Selecione o Município" value="" />
        {municipios.map((municipio) => (
          <Picker.Item key={municipio.id} label={municipio.nome} value={municipio.nome} />
        ))}
      </Picker>

      <Text>Gênero</Text>
      <Picker
        selectedValue={idGenero}
        onValueChange={setIdGenero}
        style={styles.picker}
      >
        <Picker.Item label="Selecione o Gênero" value={0} />
        {generos.map((g) => (
          <Picker.Item key={g.id} label={g.nome} value={g.id} />
        ))}
      </Picker>

      <Text>Nível de Escolaridade</Text>
      <Picker
        selectedValue={idNivelEscolaridade}
        onValueChange={setIdNivelEscolaridade}
        style={styles.picker}
      >
        <Picker.Item label="Selecione o Nível de Escolaridade" value={0} />
        {escolaridades.map((e) => (
          <Picker.Item key={e.id} label={e.nome} value={e.id} />
        ))}
      </Picker>

      <Text>Renda Familiar</Text>
      <Picker
        selectedValue={idRendaFamiliar}
        onValueChange={setIdRendaFamiliar}
        style={styles.picker}
      >
        <Picker.Item label="Selecione a Renda Familiar" value={0} />
        {rendas.map((r) => (
          <Picker.Item key={r.id} label={r.nome} value={r.id} />
        ))}
      </Picker>

      <Text>Voto Indeciso</Text>
      <Picker
        selectedValue={votoIndeciso}
        onValueChange={setVotoIndeciso}
        style={styles.picker}
      >
        <Picker.Item label="Sim" value={true} />
        <Picker.Item label="Não" value={false} />
      </Picker>

      <Text>Voto Branco/Nulo</Text>
      <Picker
        selectedValue={votoBrancoNulo}
        onValueChange={setVotoBrancoNulo}
        style={styles.picker}
      >
        <Picker.Item label="Sim" value={true} />
        <Picker.Item label="Não" value={false} />
      </Picker>

      <Text>Candidato a Prefeito</Text>
      <Picker
        selectedValue={idCandidatoPrefeito}
        onValueChange={setIdCandidatoPrefeito}
        style={styles.picker}
        enabled={uf !== '' && municipio !== ''}
      >
        <Picker.Item label="Selecione o Candidato" value={0} />
        {candidatosPrefeito.map(candidato => (
          <Picker.Item key={candidato.id} label={candidato.nomeUrna} value={candidato.id} />
        ))}
      </Picker>

      <Text>Candidato a Vereador</Text>
      <Picker
        selectedValue={idCandidatoVereador}
        onValueChange={setIdCandidatoVereador}
        style={styles.picker}
        enabled={uf !== '' && municipio !== ''}
      >
        <Picker.Item label="Selecione o Candidato" value={0} />
        {candidatosVereador.map(candidato => (
          <Picker.Item key={candidato.id} label={candidato.nomeUrna} value={candidato.id} />
        ))}
      </Picker>

      <Text>Sugestão de Melhoria</Text>
      <TextInput
        style={styles.input}
        value={sugestaoMelhoria}
        onChangeText={setSugestaoMelhoria}
        placeholder="Escreva sua sugestão"
      />

      {loading && <ActivityIndicator size="large" color="#0000ff" />}

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Salvar Pesquisa</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => router.push('/')}>
          <Text style={styles.buttonText}>Voltar</Text>
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
    justifyContent: 'center'
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
