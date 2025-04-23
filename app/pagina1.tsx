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

type Lavoura =
  | "soja"
  | "milho"
  | "mandioca"
  | "arroz"
  | "feijão"
  | "trigo"
  | "café"
  | "cana";

export default function Pagina1() {
  const [area, setArea] = useState("");
  const [unidade, setUnidade] = useState("hectare");
  const [lavoura, setLavoura] = useState<Lavoura>("soja");

  const [Nideal, setNideal] = useState("50");
  const [Pideal, setPideal] = useState("60");
  const [Kideal, setKideal] = useState("80");

  const [N, setN] = useState("");
  const [P, setP] = useState("");
  const [K, setK] = useState("");

  const [fertN, setFertN] = useState("");
  const [fertP, setFertP] = useState("");
  const [fertK, setFertK] = useState("");

  const [resultado, setResultado] = useState<string | null>(null);

  const predefinidos = {
    soja: { N: "50", P: "60", K: "80" },
    milho: { N: "120", P: "90", K: "100" },
    mandioca: { N: "80", P: "50", K: "120" },
    arroz: { N: "80", P: "60", K: "90" },
    feijão: { N: "40", P: "30", K: "50" },
    trigo: { N: "100", P: "70", K: "90" },
    café: { N: "150", P: "100", K: "150" },
    cana: { N: "100", P: "80", K: "120" },
  };

  const atualizarIdeais = (cult: Lavoura) => {
    setLavoura(cult);
    setNideal(predefinidos[cult].N);
    setPideal(predefinidos[cult].P);
    setKideal(predefinidos[cult].K);
  };

  const calcular = () => {
    const areaNum = parseFloat(area);
    const areaHa = unidade === "metro" ? areaNum / 10000 : areaNum;

    const Ndisp = parseFloat(N);
    const Pdisp = parseFloat(P);
    const Kdisp = parseFloat(K);

    const Nref = parseFloat(Nideal);
    const Pref = parseFloat(Pideal);
    const Kref = parseFloat(Kideal);

    const fertNval = parseFloat(fertN);
    const fertPval = parseFloat(fertP);
    const fertKval = parseFloat(fertK);

    if (
      isNaN(areaNum) ||
      areaNum <= 0 ||
      [Ndisp, Pdisp, Kdisp, Nref, Pref, Kref, fertNval, fertPval, fertKval].some((v) => isNaN(v))
    ) {
      Alert.alert("Erro", "Preencha todos os campos corretamente.");
      return;
    }

    const necessidade = {
      N: Math.max(Nref - Ndisp, 0),
      P: Math.max(Pref - Pdisp, 0),
      K: Math.max(Kref - Kdisp, 0),
    };

    const total = {
      N: necessidade.N * areaHa,
      P: necessidade.P * areaHa,
      K: necessidade.K * areaHa,
    };

    const adubo = {
      N: necessidade.N > 0 ? total.N / (fertNval / 100) : 0,
      P: necessidade.P > 0 ? total.P / (fertPval / 100) : 0,
      K: necessidade.K > 0 ? total.K / (fertKval / 100) : 0,
    };

    const texto = `
🌱 Cálculo de Adubação (${lavoura.toUpperCase()}) — ${areaNum} ${unidade === "metro" ? "m²" : "ha"}

📊 Valores Ideais:
- N: ${Nref} | P: ${Pref} | K: ${Kref}

🧪 Nutrientes no Solo:
- N: ${Ndisp} | P: ${Pdisp} | K: ${Kdisp}

🧮 Necessidade Total:
- N: ${total.N.toFixed(2)} kg
- P: ${total.P.toFixed(2)} kg
- K: ${total.K.toFixed(2)} kg

📦 Quantidade de Adubo a Aplicar:
- Para N: ${adubo.N.toFixed(2)} kg
- Para P: ${adubo.P.toFixed(2)} kg
- Para K: ${adubo.K.toFixed(2)} kg
    `.trim();

    setResultado(texto);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
      <Text style={styles.header}>Adubação Personalizada</Text>

      <Text style={styles.label}>Área da plantação:</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={area}
        onChangeText={setArea}
        placeholder="Ex: 2.5"
      />

      <Text style={styles.label}>Unidade:</Text>
      <Picker selectedValue={unidade} onValueChange={setUnidade} style={styles.picker}>
        <Picker.Item label="Hectare" value="hectare" />
        <Picker.Item label="Metro quadrado" value="metro" />
      </Picker>

      <Text style={styles.label}>Tipo de lavoura:</Text>
      <Picker selectedValue={lavoura} onValueChange={atualizarIdeais} style={styles.picker}>
        {Object.keys(predefinidos).map((cult) => (
          <Picker.Item
            key={cult}
            label={cult.charAt(0).toUpperCase() + cult.slice(1)}
            value={cult}
          />
        ))}
      </Picker>

      <Text style={styles.section}>📈 Valores Ideais</Text>
      <TextInput style={styles.input} placeholder="N ideal" value={Nideal} onChangeText={setNideal} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="P ideal" value={Pideal} onChangeText={setPideal} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="K ideal" value={Kideal} onChangeText={setKideal} keyboardType="numeric" />

      <Text style={styles.section}>🧪 Nutrientes no Solo</Text>
      <TextInput style={styles.input} placeholder="N disponível" value={N} onChangeText={setN} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="P disponível" value={P} onChangeText={setP} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="K disponível" value={K} onChangeText={setK} keyboardType="numeric" />

      <Text style={styles.section}>📦 Composição do Adubo (%)</Text>
      <TextInput style={styles.input} placeholder="N (%)" value={fertN} onChangeText={setFertN} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="P₂O₅ (%)" value={fertP} onChangeText={setFertP} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="K₂O (%)" value={fertK} onChangeText={setFertK} keyboardType="numeric" />

      <View style={{ marginTop: 20 }}>
        <Button title="Calcular adubação" onPress={calcular} />
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
  section: {
    fontSize: 18,
    marginTop: 20,
    fontWeight: "bold",
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
