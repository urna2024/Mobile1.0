import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, ImageBackground, Image, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts, Cabin_400Regular, Cabin_700Bold } from '@expo-google-fonts/cabin';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false); // Para mostrar o estado de carregamento durante o login
    const router = useRouter();

    // Carregar as fontes Cabin
    let [fontsLoaded] = useFonts({
        Cabin_400Regular,
        Cabin_700Bold,
    });

    // Exibe um indicador de carregamento enquanto as fontes não são carregadas
    if (!fontsLoaded) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007bff" />
            </View>
        );
    }

    const handleLogin = async () => {
        setLoading(true); // Ativa o estado de carregamento

        try {
            const response = await axios.post('http://ggustac-002-site1.htempurl.com/api/Seguranca/Login', {
                email,
                senha: password, // Certifique-se de que a API espera 'senha' no corpo da requisição
            });

            if (response.status === 200) {
                const token = response.data.token;
                await AsyncStorage.setItem('token', token); // Armazena o token no AsyncStorage

                // Verifica se o token foi armazenado corretamente
                const storedToken = await AsyncStorage.getItem('token');
                console.log('Token armazenado:', storedToken); // Certifique-se de que o token foi salvo corretamente

                // Redirecionar o usuário para a tela de lista de candidatos
                router.replace('/candidato/list'); // Usa replace para não manter a página de login no histórico
            } else {
                Alert.alert('Erro', 'Credenciais inválidas. Por favor, tente novamente.');
            }
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            Alert.alert('Erro', 'Ocorreu um erro durante o login. Verifique sua conexão.');
        } finally {
            setLoading(false); // Desativa o estado de carregamento após o login
        }
    };

    return (
        <ImageBackground
            source={require('../../assets/images/fundo.jpg')} 
            style={styles.background}
        >
            <View style={styles.overlay}>
                <Image
                    source={require('../../assets/images/urna.png')} 
                    style={styles.logo}
                />
                
                {/* Adicionando o nome do sistema acima do login */}
                <Text style={styles.systemTitle}>Sistema de Pesquisa de Votos</Text>

                <Text style={styles.title}>Login</Text>

                <Text style={styles.label}>Nome</Text>
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Digite seu nome"
                    placeholderTextColor="#aaa"
                    keyboardType="default"
                    autoCapitalize="none"
                />

                <Text style={styles.label}>Senha</Text>
                <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Digite sua senha"
                    placeholderTextColor="#aaa"
                    secureTextEntry
                />

                {/* Exibir um indicador de carregamento ao pressionar "Entrar" */}
                {loading ? (
                    <ActivityIndicator size="large" color="#007bff" />
                ) : (
                    <TouchableOpacity style={styles.button} onPress={handleLogin}>
                        <Text style={styles.buttonText}>Entrar</Text>
                    </TouchableOpacity>
                )}
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        resizeMode: 'cover', 
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.6)', 
        width: '100%',
    },
    logo: {
        width: 180,
        height: 180,
        marginBottom: 30,
        resizeMode: 'contain', 
    },
    systemTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        fontFamily: 'Cabin_700Bold',
        marginBottom: 10, 
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
        fontFamily: 'Cabin_700Bold', 
    },
    label: {
        alignSelf: 'flex-start',
        marginLeft: '5%',
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
        fontFamily: 'Cabin_400Regular', 
    },
    input: {
        width: '90%',
        height: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.9)', 
        borderRadius: 8,
        marginBottom: 15,
        paddingHorizontal: 15,
        fontSize: 16,
        color: '#333',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        fontFamily: 'Cabin_400Regular',
    },
    button: {
        width: '90%',
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Cabin_700Bold',
    },
});
