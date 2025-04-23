import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export const options = {
  headerShown: false,
};

export default function HomeScreen() {
  const router = useRouter();

  const pages = [
    "/pagina1",
    "/pagina2",
    "/pagina3",
    "/pagina4",
    "/pagina5",
    "/pagina6",
  ] as const;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Agro Help</Text>
      <View style={styles.grid}>
        {pages.map((page, index) => (
          <TouchableOpacity
            key={index}
            style={styles.button}
            onPress={() => router.push(page)}
          >
            <Text style={styles.buttonText}>Página {index + 1}</Text>
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
    justifyContent: "center",
  },
  button: {
    width: 100,
    height: 100,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
  },
});
