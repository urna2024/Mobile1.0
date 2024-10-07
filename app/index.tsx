import React from 'react';
import { Redirect } from 'expo-router';

export default function Index() {
  
  return <Redirect href="/candidato/list" />;
}
export const metadata = {
  title: 'MapeiaVoto',  // Título que aparece no topo
};

