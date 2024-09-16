import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" /> {/* Aponta para /app/index.tsx */}
      <Stack.Screen name="candidato/form" /> {/* Será mapeado para /app/candidato/form.tsx */}
    </Stack>
  );
}
