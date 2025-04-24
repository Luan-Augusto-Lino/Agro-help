import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator, Dimensions } from "react-native";
import * as Location from "expo-location";

// Tipagens para os dados da API
type WeatherCondition = {
  text: string;
  icon: string;
};

type ForecastDay = {
  date: string;
  day: {
    maxtemp_c: number;
    mintemp_c: number;
    condition: WeatherCondition;
    daily_chance_of_rain: number;
    totalprecip_mm: number;
    avghumidity: number;
    maxwind_kph: number;
    uv: number; // Índice UV
  };
};

type ForecastData = {
  location: {
    name: string;
    region: string;
  };
  forecast: {
    forecastday: ForecastDay[];
  };
};

export default function Pagina3() {
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permissão para acessar localização negada");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});

      try {
        const response = await fetch(
          `https://api.weatherapi.com/v1/forecast.json?key=08a35c52b3d3452b9d5141115252404&q=${loc.coords.latitude},${loc.coords.longitude}&days=7&lang=pt`
        );
        const data: ForecastData = await response.json();
        setForecast(data);
      } catch (error) {
        setErrorMsg("Erro ao buscar dados do clima.");
      }
    })();
  }, []);

  if (errorMsg) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>{errorMsg}</Text>
      </View>
    );
  }

  if (!forecast) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.text}>Carregando previsão do tempo...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Previsão do tempo para os próximos 7 dias</Text>

      <ScrollView horizontal style={styles.cardsContainer}>
        {forecast.forecast.forecastday.map((day, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.date}>{day.date}</Text>
            <Image
              source={{ uri: `https:${day.day.condition.icon}` }}
              style={styles.icon}
            />
            <Text style={styles.text}>{day.day.condition.text}</Text>
            <Text style={styles.text}>Máx: {day.day.maxtemp_c}°C</Text>
            <Text style={styles.text}>Mín: {day.day.mintemp_c}°C</Text>
            <Text style={styles.text}>
              Chuva: {day.day.daily_chance_of_rain}% - Precipitação: {day.day.totalprecip_mm} mm
            </Text>
            <Text style={styles.text}>Umidade: {day.day.avghumidity}%</Text>
            <Text style={styles.text}>Vento: {day.day.maxwind_kph} km/h</Text>
            <Text style={styles.text}>Índice UV: {day.day.uv}</Text>
          </View>
        ))}
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
    textAlign: "center",
  },
  cardsContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  card: {
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 15,
    marginRight: 15,
    width: Dimensions.get("window").width * 0.8, // Faz o card ocupar 80% da largura da tela
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  date: {
    fontSize: 16,
    fontWeight: "bold",
  },
  icon: {
    width: 60, // Ajustado para ser proporcional
    height: 60, // Ajustado para ser proporcional
    marginVertical: 10,
  },
  text: {
    fontSize: 14,
    marginVertical: Dimensions.get("window").height * 0.02,
    textAlign: "center",
  },
});
