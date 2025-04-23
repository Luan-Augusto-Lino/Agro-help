import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="Tabs" options={{ headerShown: false }} />
      <Stack.Screen name="pagina1" options={{ title: "Cálculo de Adubo" }} />
      <Stack.Screen name="pagina2" options={{ title: "Cálculo de Agrotóxicos" }} />
      <Stack.Screen name="pagina3" options={{ title: "Previsão do Tempo" }} />
      <Stack.Screen name="pagina4" options={{ title: "Calendário de Plantio" }} />
      <Stack.Screen name="pagina5" options={{ title: "Armazém" }} />
      <Stack.Screen name="pagina6" options={{ title: "Dicas" }} />
    </Stack>
  );
}