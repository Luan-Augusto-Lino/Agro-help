import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, Button, FlatList, StyleSheet,
  Alert, Modal, ActivityIndicator
} from 'react-native';
import * as SQLite from 'expo-sqlite';
import * as Notifications from 'expo-notifications';
import { format, parseISO, isValid } from 'date-fns';
import { Calendar, DateData } from 'react-native-calendars';

type Evento = {
  id: number;
  nome: string;
  data: string;
};

let db: SQLite.SQLiteDatabase;

export default function TelaEventos() {
  const [nomeEvento, setNomeEvento] = useState('');
  const [dataSelecionada, setDataSelecionada] = useState<string | null>(null);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [markedDates, setMarkedDates] = useState<any>({});

  const [modalVisible, setModalVisible] = useState(false);
  const [eventoEditando, setEventoEditando] = useState<Evento | null>(null);
  const [novoNome, setNovoNome] = useState('');
  const [novaDataSelecionada, setNovaDataSelecionada] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      db = await SQLite.openDatabaseAsync('agro_help.db');
      await criarTabela();
      await buscarEventos();
      setCarregando(false);
    })();
  }, []);

  const criarTabela = async () => {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS eventos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        data TEXT NOT NULL
      );
    `);
  };

  const adicionarEvento = async () => {
    if (!nomeEvento || !dataSelecionada) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    try {
      await db.runAsync('INSERT INTO eventos (nome, data) VALUES (?, ?)', nomeEvento, dataSelecionada);
      await agendarNotificacao(nomeEvento, dataSelecionada);
      setNomeEvento('');
      setDataSelecionada(null);
      buscarEventos();
    } catch (error) {
      console.error('Erro ao adicionar evento:', error);
    }
  };

  const buscarEventos = async () => {
    try {
      const rows = await db.getAllAsync('SELECT * FROM eventos;');
      const eventosArray = rows as Evento[];

      const eventosMarcados = eventosArray.reduce((acc, evento) => {
        const data = parseISO(evento.data);
        if (isValid(data)) {
          const dataFormatada = format(data, 'yyyy-MM-dd');
          acc[dataFormatada] = { marked: true, dotColor: 'red' };
        }
        return acc;
      }, {} as any);

      setMarkedDates(eventosMarcados);
      setEventos(eventosArray);
    } catch (error) {
      console.error('Erro ao buscar eventos:', error);
    }
  };

  const deletarEvento = async (id: number) => {
    await db.runAsync('DELETE FROM eventos WHERE id = ?', id);
    buscarEventos();
  };

  const iniciarEdicao = (evento: Evento) => {
    setEventoEditando(evento);
    setNovoNome(evento.nome);
    setNovaDataSelecionada(evento.data);
    setModalVisible(true);
  };

  const salvarEdicao = async () => {
    if (!eventoEditando || !novaDataSelecionada) return;

    await db.runAsync(
      'UPDATE eventos SET nome = ?, data = ? WHERE id = ?',
      novoNome,
      novaDataSelecionada,
      eventoEditando.id
    );

    setModalVisible(false);
    buscarEventos();
  };

  const agendarNotificacao = async (titulo: string, dataStr: string) => {
    const data = parseISO(dataStr);
    const antecipado = new Date(data.getTime() - 24 * 60 * 60 * 1000);

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Lembrete: ' + titulo,
        body: `O evento "${titulo}" está programado para ${format(data, 'dd/MM/yyyy')}`,
      },
      trigger: { date: antecipado } as Notifications.DateTriggerInput,
    });
  };

  if (carregando) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Adicionar Evento</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome do evento"
        value={nomeEvento}
        onChangeText={setNomeEvento}
      />

      <Text style={styles.titulo}>Selecione uma data</Text>
      <Calendar
        onDayPress={(day: DateData) => setDataSelecionada(day.dateString)}
        markedDates={{
          ...markedDates,
          ...(dataSelecionada ? {
            [dataSelecionada]: { selected: true, selectedColor: 'blue' }
          } : {})
        }}
      />

      <Button title="Salvar Evento" onPress={adicionarEvento} />

      <Text style={styles.titulo}>Eventos Salvos</Text>

      <FlatList
        data={eventos}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const dataValida = parseISO(item.data);
          return (
            <View style={styles.evento}>
              <Text style={styles.eventoNome}>{item.nome}</Text>
              <Text>
                {isValid(dataValida)
                  ? format(dataValida, 'dd/MM/yyyy')
                  : 'Data inválida'}
              </Text>
              <View style={styles.botoes}>
                <Button title="Editar" onPress={() => iniciarEdicao(item)} />
                <Button title="Excluir" color="red" onPress={() => deletarEvento(item.id)} />
              </View>
            </View>
          );
        }}
      />

      {/* Modal de edição com calendário interativo */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.titulo}>Editar Evento</Text>

            <TextInput
              style={styles.input}
              placeholder="Nome do evento"
              value={novoNome}
              onChangeText={setNovoNome}
            />

            <Text style={styles.titulo}>Nova data:</Text>
            <Calendar
              onDayPress={(day: DateData) => setNovaDataSelecionada(day.dateString)}
              markedDates={{
                ...(novaDataSelecionada ? {
                  [novaDataSelecionada]: { selected: true, selectedColor: 'blue' }
                } : {})
              }}
            />

            <View style={styles.botoes}>
              <Button title="Salvar" onPress={salvarEdicao} />
              <Button title="Cancelar" color="red" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </View>
      </Modal>
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
    textAlign: 'center',
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
  botoes: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
});
