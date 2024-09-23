import React from 'react';
import { Redirect } from 'expo-router';

export default function Index() {
  // Redireciona diretamente para a página de listagem de candidatos
  return <Redirect href="/candidato/list" />;
}
