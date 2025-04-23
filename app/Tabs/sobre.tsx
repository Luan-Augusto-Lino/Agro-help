import { View, Text, StyleSheet } from "react-native";

export const options = {
  headerShown: false,
};

export default function SobreScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sobre o Agro Help</Text>
      <Text style={styles.text}>
        Este aplicativo tem como objetivo auxiliar produtores rurais com acesso rápido a recursos e informações úteis.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 10,
  },
  text: {
    fontSize: 18,
  },
});
