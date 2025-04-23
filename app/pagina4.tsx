import { View, Text, StyleSheet } from "react-native";

export default function Pagina4() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Você está na Página 4</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
  },
});
