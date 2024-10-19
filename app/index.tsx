import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';  // Para fazer a verificação do token

export default function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const router = useRouter();

  // Verifica se o token é válido, usando um endpoint de validação
  const validateToken = async (token: string) => {
    try {
      const response = await axios.post('http://ggustac-002-site1.htempurl.com/api/Seguranca/ValidateToken', null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.status === 200;  // Se a resposta for 200, o token é válido
    } catch (error) {
      console.error('Token inválido ou expirado:', error);
      return false;  // Se houver erro, o token não é válido
    }
  };

  // Checa se o usuário está logado e se o token é válido
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userToken = await AsyncStorage.getItem('token');

        if (userToken) {
          const isValid = await validateToken(userToken);
          setIsLoggedIn(isValid); // Define como logado se o token for válido
        } else {
          setIsLoggedIn(false); // Não logado se não houver token
        }
      } catch (error) {
        console.error('Erro ao verificar o estado de login:', error);
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  // Redireciona com base no estado de login
  useEffect(() => {
    if (isLoggedIn === null) return; // Aguarda a verificação

    if (isLoggedIn) {
      router.push('/candidato/list'); // Redireciona se logado
    } else {
      router.push('/login/login1'); // Redireciona para login se não logado
    }
  }, [isLoggedIn]);

  // Função de logout
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token'); // Remove o token do armazenamento
      setIsLoggedIn(false); // Atualiza o estado de login
      router.push('/login/login1'); // Redireciona para a tela de login
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  // Enquanto o status de login é verificado, não exibe nada
  return null;
}
