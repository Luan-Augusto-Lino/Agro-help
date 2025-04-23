import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  ScrollView,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function PaginaAgrotoxico() {
  const [area, setArea] = useState("");
  const [unidade, setUnidade] = useState("hectare");
  const [volumeCalda, setVolumeCalda] = useState("");
  const [capacidadeTanque, setCapacidadeTanque] = useState("");
  const [doseRecomendada, setDoseRecomendada] = useState("");
  const [resultado, setResultado] = useState<string | null>(null);

  const calcularAgrotoxico = () => {
    const areaNum = parseFloat(area);
    const volumeCaldaNum = parseFloat(volumeCalda);
    const capacidadeTanqueNum = parseFloat(capacidadeTanque);
    const doseRecomendadaNum = parseFloat(doseRecomendada);

    const areaHa = unidade === "metro" ? areaNum / 10000 : areaNum;

    if (
      [areaNum, volumeCaldaNum, capacidadeTanqueNum, doseRecomendadaNum].some((v) => isNaN(v) || v <= 0)
    ) {
      Alert.alert("Erro", "Preencha todos os campos corretamente.");
      return;
    }

    const numeroTanques = (areaHa * volumeCaldaNum) / capacidadeTanqueNum;
    const produtoPorTanque = (doseRecomendadaNum * capacidadeTanqueNum) / volumeCaldaNum;

    const texto = `
🌾 Cálculo de Aplicação de Agrotóxicos

📐 Área total: ${areaNum} ${unidade === "metro" ? "m²" : "ha"}
💧 Volume de calda por hectare: ${volumeCaldaNum} L
🛢️ Capacidade do tanque: ${capacidadeTanqueNum} L
🧪 Dose recomendada: ${doseRecomendadaNum} L/ha

🧮 Número de tanques necessários: ${numeroTanques.toFixed(2)}
📦 Produto por tanque: ${produtoPorTanque.toFixed(2)} L
    `.trim();

    setResultado(texto);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.header}>Aplicação de Agrotóxicos</Text>

      <Text style={styles.label}>Área da plantação:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={area}
        onChangeText={setArea}
        placeholder="Ex: 10"
      />

      <Text style={styles.label}>Unidade:</Text>
      <Picker selectedValue={unidade} onValueChange={setUnidade} style={styles.picker}>
        <Picker.Item label="Hectare" value="hectare" />
        <Picker.Item label="Metro quadrado" value="metro" />
      </Picker>

      <Text style={styles.label}>Volume de calda por hectare (L/ha):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={volumeCalda}
        onChangeText={setVolumeCalda}
      />

      <Text style={styles.label}>Capacidade do tanque (L):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={capacidadeTanque}
        onChangeText={setCapacidadeTanque}
      />

      <Text style={styles.label}>Dose recomendada do produto (L/ha):</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={doseRecomendada}
        onChangeText={setDoseRecomendada}
      />

      <View style={{ marginTop: 20 }}>
        <Button title="Calcular aplicação" onPress={calcularAgrotoxico} />
      </View>

      {resultado && (
        <View style={styles.resultadoContainer}>
          <Text style={styles.resultadoTexto}>{resultado}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
  },
  picker: {
    marginTop: 5,
    marginBottom: 10,
  },
  resultadoContainer: {
    marginTop: 30,
    padding: 15,
    backgroundColor: "#f0f8ff",
    borderRadius: 10,
  },
  resultadoTexto: {
    fontSize: 16,
    lineHeight: 24,
  },
});
