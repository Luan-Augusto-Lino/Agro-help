import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export const options = {
  headerShown: false,
};

export default function HomeScreen() {
  const router = useRouter();

  const pages = [
    { route: "/pagina1" as const, label: "Cálculo de Adubo" },
    { route: "/pagina2" as const, label: "Cálculo de Agrotóxicos" },
    { route: "/pagina3" as const, label: "Previsão do Tempo" },
    { route: "/pagina4" as const, label: "Calendário de Plantio" },
    { route: "/pagina5" as const, label: "Armazém" },
    { route: "/pagina6" as const, label: "Dicas" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Agro Help</Text>
      <View style={styles.grid}>
        {pages.map((page, index) => (
          <TouchableOpacity
            key={index}
            style={styles.button}
            onPress={() => router.push(page.route)}
          >
            <Text style={styles.buttonText}>{page.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "90%",
  },
  button: {
    flexBasis: "48%",
    height: 120,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderRadius: 10,
    padding: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
});
