import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert } from 'react-native';
import * as SQLite from 'expo-sqlite';
import * as Notifications from 'expo-notifications';
import { format } from 'date-fns';

// Usando openDatabase
const db = SQLite.openDatabase('agro_help.db');

type Evento = {
  id: number;
  nome: string;
  data: string;
};

export default function TelaEventos() {
  const [nomeEvento, setNomeEvento] = useState('');
  const [dataEvento, setDataEvento] = useState('');
  const [eventos, setEventos] = useState<Evento[]>([]);

  useEffect(() => {
    criarTabela();
    buscarEventos();
  }, []);

  const criarTabela = () => {
    try {
      db.transaction((tx) => {
        tx.executeSql(
          `CREATE TABLE IF NOT EXISTS eventos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            data TEXT NOT NULL
          );`
        );
      });
    } catch (error) {
      console.error('Erro ao criar tabela:', error);
    }
  };

  const adicionarEvento = () => {
    if (!nomeEvento || !dataEvento) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    try {
      db.transaction((tx) => {
        tx.executeSql(
          'INSERT INTO eventos (nome, data) VALUES (?, ?);',
          [nomeEvento, dataEvento],
          (_, result) => {
            console.log('Evento adicionado:', result);
            agendarNotificacao(nomeEvento, dataEvento);
            setNomeEvento('');
            setDataEvento('');
            buscarEventos();
          }
        );
      });
    } catch (error) {
      console.error('Erro ao adicionar evento:', error);
    }
  };

  const buscarEventos = () => {
    try {
      db.transaction((tx) => {
        tx.executeSql('SELECT * FROM eventos;', [], (_, result) => {
          setEventos(result.rows._array);
        });
      });
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
    }
  };

  const agendarNotificacao = async (titulo: string, dataStr: string) => {
    const data = new Date(dataStr);
    const antecipado = new Date(data.getTime() - 24 * 60 * 60 * 1000); // 1 dia antes

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Lembrete: ' + titulo,
        body: `O evento "${titulo}" está programado para ${format(data, 'dd/MM/yyyy')}`,
      },
      trigger: antecipado,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Adicionar Evento</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome do evento"
        value={nomeEvento}
        onChangeText={setNomeEvento}
      />

      <TextInput
        style={styles.input}
        placeholder="Data (YYYY-MM-DD)"
        value={dataEvento}
        onChangeText={setDataEvento}
      />

      <Button title="Salvar Evento" onPress={adicionarEvento} />

      <Text style={styles.titulo}>Eventos Salvos</Text>
      <FlatList
        data={eventos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.evento}>
            <Text style={styles.eventoNome}>{item.nome}</Text>
            <Text>{format(new Date(item.data), 'dd/MM/yyyy')}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#999',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  evento: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  eventoNome: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
