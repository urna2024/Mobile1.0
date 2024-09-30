import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';

interface Candidato {
  id: number;
  nomeUrna: string;
  partido: string;
  foto: string;
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
  const [candidatoPrefeitoDetalhes, setCandidatoPrefeitoDetalhes] = useState<Candidato | null>(null);
  const [candidatoVereadorDetalhes, setCandidatoVereadorDetalhes] = useState<Candidato | null>(null);

  const router = useRouter();

  // Função para formatar o telefone (DDD e número)
  const formatarTelefone = (telefone: string) => {
    const apenasNumeros = telefone.replace(/\D/g, '');
    if (apenasNumeros.length <= 10) {
      return apenasNumeros.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{4})(\d)/, '$1-$2');
    } else {
      return apenasNumeros.replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2');
    }
  };

  // Função para formatar a data no formato "DD/MM/AAAA"
  const formatarData = (data: string) => {
    const apenasNumeros = data.replace(/\D/g, '');
    if (apenasNumeros.length <= 8) {
      return apenasNumeros.replace(/(\d{2})(\d)/, '$1/$2').replace(/(\d{2})(\d)/, '$1/$2');
    }
    return data;
  };

  // Carregar estados (UF) da API do IBGE
  useEffect(() => {
    axios.get<UF[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then(response => setUfs(response.data))
      .catch(error => console.error('Erro ao carregar estados:', error));
  }, []);

  // Carregar municípios com base na UF selecionada
  useEffect(() => {
    if (uf) {
      axios.get<Municipio[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`)
        .then(response => setMunicipios(response.data))
        .catch(error => console.error('Erro ao carregar municípios:', error));
    }
  }, [uf]);

  // Carregar candidatos a prefeito e vereador com base na UF e município selecionados
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

  // Carregar generos, níveis de escolaridade e rendas familiares
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

  const handleSelectCandidatoPrefeito = (id: number) => {
    setIdCandidatoPrefeito(id);
    if (id !== 0) {
      axios.get<Candidato>(`http://ggustac-002-site1.htempurl.com/api/Candidato/${id}/dadosCompletos`)
        .then(response => setCandidatoPrefeitoDetalhes(response.data))
        .catch(error => console.error('Erro ao carregar detalhes do candidato a prefeito:', error));
    }
  };

  const handleSelectCandidatoVereador = (id: number) => {
    setIdCandidatoVereador(id);
    if (id !== 0) {
      axios.get<Candidato>(`http://ggustac-002-site1.htempurl.com/api/Candidato/${id}/dadosCompletos`)
        .then(response => setCandidatoVereadorDetalhes(response.data))
        .catch(error => console.error('Erro ao carregar detalhes do candidato a vereador:', error));
    }
  };

  const handleSave = () => {
    const pesquisaData = {
      dataEntrevista: new Date().toISOString(),
      uf,
      municipio,
      votoIndeciso,
      votoBrancoNulo,
      sugestaoMelhoria,
      idCandidatoPrefeito: idCandidatoPrefeito,
      idCandidatoVereador: idCandidatoVereador,
      idUsuario: 1,
      idStatus: 1,
      entrevistado: [{
        nomeCompleto: entrevistadoNome,
        dataNascimento: entrevistadoDataNascimento,
        uf,
        municipio,
        celular: entrevistadoCelular,
        idGenero: idGenero,
        idNivelEscolaridade: idNivelEscolaridade,
        idRendaFamiliar: idRendaFamiliar,
      }]
    };

    axios.post('http://ggustac-002-site1.htempurl.com/api/PesquisaEleitoral', pesquisaData)
      .then(() => {
        Alert.alert('Sucesso', 'Pesquisa eleitoral salva com sucesso!');
        router.push('/'); 
      })
      .catch(error => {
        console.error('Erro ao salvar pesquisa eleitoral:', error);
        Alert.alert('Erro', 'Ocorreu um erro ao salvar a pesquisa eleitoral.');
      });
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
        onChangeText={(text) => setEntrevistadoDataNascimento(formatarData(text))}
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
        onValueChange={(itemValue) => setVotoIndeciso(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Sim" value={true} />
        <Picker.Item label="Não" value={false} />
      </Picker>

      <Text>Voto Branco/Nulo</Text>
      <Picker
        selectedValue={votoBrancoNulo}
        onValueChange={(itemValue) => setVotoBrancoNulo(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Sim" value={true} />
        <Picker.Item label="Não" value={false} />
      </Picker>

      <Text>Candidato a Prefeito</Text>
      <Picker
        selectedValue={idCandidatoPrefeito}
        onValueChange={(itemValue: number) => handleSelectCandidatoPrefeito(itemValue)}
        style={styles.picker}
        enabled={uf !== '' && municipio !== ''}
      >
        <Picker.Item label="Selecione um candidato" value={0} />
        {candidatosPrefeito.map(candidato => (
          <Picker.Item key={candidato.id} label={candidato.nomeUrna} value={candidato.id} />
        ))}
      </Picker>

      {candidatoPrefeitoDetalhes && (
        <View style={styles.candidatoDetalhes}>
          <Text>Partido: {candidatoPrefeitoDetalhes.partido}</Text>
          {candidatoPrefeitoDetalhes.foto && (
            <Image source={{ uri: candidatoPrefeitoDetalhes.foto }} style={styles.candidatoFoto} />
          )}
        </View>
      )}

      <Text>Candidato a Vereador</Text>
      <Picker
        selectedValue={idCandidatoVereador}
        onValueChange={(itemValue: number) => handleSelectCandidatoVereador(itemValue)}
        style={styles.picker}
        enabled={uf !== '' && municipio !== ''}
      >
        <Picker.Item label="Selecione um candidato" value={0} />
        {candidatosVereador.map(candidato => (
          <Picker.Item key={candidato.id} label={candidato.nomeUrna} value={candidato.id} />
        ))}
      </Picker>

      {candidatoVereadorDetalhes && (
        <View style={styles.candidatoDetalhes}>
          <Text>Partido: {candidatoVereadorDetalhes.partido}</Text>
          {candidatoVereadorDetalhes.foto && (
            <Image source={{ uri: candidatoVereadorDetalhes.foto }} style={styles.candidatoFoto} />
          )}
        </View>
      )}

      <Text>Sugestão de Melhoria</Text>
      <TextInput
        style={styles.input}
        value={sugestaoMelhoria}
        onChangeText={setSugestaoMelhoria}
        placeholder="Escreva uma sugestão"
      />

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Salvar Pesquisa</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={() => router.push('/')}>
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
  candidatoDetalhes: {
    marginVertical: 10,
  },
  candidatoFoto: {
    width: 100,
    height: 100,
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
});
