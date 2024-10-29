import axios from "axios";
import { useState } from "react";
import { Button, Alert, View, Text, TextInput, StyleSheet } from "react-native"; // Adicionei Text e removi a importação duplicada

export default function RedefinirSenha({ navigation }: { navigation: any }) {
    const [senha, setSenha] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
    const handleRedefinirSenha = async () => {
      setLoading(true);
      setErrorMessage(null);
  
      const id = 0;
  
      try {
        const response = await axios.put('http://ggustac-002-site1.htempurl.com/api/Seguranca/TrocarSenha', {
          id,
          senha,
          novaSenha,
        });
  
        if (response.status === 200) {
          Alert.alert('Sucesso', 'Senha redefinida com sucesso!');
          navigation.navigate('login/login1');
        }
      } catch (error: any) {
        if (error.response && error.response.data) {
          const errors = error.response.data;
          const novaSenhaError = errors.find(
            (err: { propertyName: string }) => err.propertyName === 'novaSenha'
          );
          if (novaSenhaError) {
            setErrorMessage(novaSenhaError.errorMessage);
          } else {
            Alert.alert('Erro', 'Ocorreu um erro ao redefinir a senha.');
          }
        } else {
          Alert.alert('Erro', 'Ocorreu um erro ao redefinir a senha.');
        }
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Redefinir Senha</Text>
  
        <TextInput
          style={styles.input}
          placeholder="Senha Atual"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />
  
        <TextInput
          style={styles.input}
          placeholder="Nova Senha"
          secureTextEntry
          value={novaSenha}
          onChangeText={setNovaSenha}
        />
        {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
  
        <Button title={loading ? 'Carregando...' : 'Redefinir Senha'} onPress={handleRedefinirSenha} disabled={loading} />
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#192150',
      justifyContent: 'center',
    },
    title: {
      fontSize: 24,
      color: '#fff',
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 20,
    },
    input: {
      backgroundColor: '#fff',
      padding: 10,
      borderRadius: 5,
      marginBottom: 15,
      fontSize: 16,
    },
    errorText: {
      color: 'red',
      fontSize: 14,
      marginBottom: 10,
    },
  });
