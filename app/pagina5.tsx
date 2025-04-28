import React, { useState, useEffect } from 'react';
import { Alert, View, Text, TextInput, Button, FlatList, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { FontAwesome } from '@expo/vector-icons';

type Item = {
  id: number;
  nome: string;
  quantidade: string;
};

let db: SQLite.SQLiteDatabase;

export default function Pagina5() {
  const [nomeItem, setNomeItem] = useState('');
  const [quantidade, setQuantidade] = useState('0');
  const [itens, setItens] = useState<Item[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [itemEditando, setItemEditando] = useState<Item | null>(null);
  const [novaQuantidade, setNovaQuantidade] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        db = await SQLite.openDatabaseAsync('armazen.db');
        await criarTabela();
        await buscarItens();
      } catch (error) {
        Alert.alert('Erro ao abrir banco de dados');
      }
    })();
  }, []);

  const criarTabela = async () => {
    try {
      await db.execAsync(`
        CREATE TABLE IF NOT EXISTS itens (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          nome TEXT NOT NULL,
          quantidade TEXT NOT NULL
        );
      `);
    } catch (error) {
      Alert.alert('Erro ao criar tabela');
    }
  };

  const adicionarItem = async () => {
    if (!nomeItem || novaQuantidade <= 0) {
      Alert.alert('Erro', 'Preencha todos os campos corretamente');
      return;
    }

    try {
      await db.runAsync('INSERT INTO itens (nome, quantidade) VALUES (?, ?)', nomeItem, novaQuantidade.toString());
      setNomeItem('');
      setNovaQuantidade(0);
      buscarItens();
      setModalVisible(false);
    } catch (error) {
      Alert.alert('Erro ao adicionar item');
    }
  };

  const buscarItens = async () => {
    try {
      const rows = await db.getAllAsync('SELECT * FROM itens;');
      const itensArray = rows as Item[];
      setItens(itensArray);
    } catch (error) {
      Alert.alert('Erro ao buscar itens');
    }
  };

  const deletarItem = async (id: number) => {
    await db.runAsync('DELETE FROM itens WHERE id = ?', id);
    buscarItens();
  };

  const iniciarEdicao = (item: Item) => {
    setItemEditando(item);
    setNovaQuantidade(parseFloat(item.quantidade));
    setModalVisible(true);
  };

  const salvarEdicao = async () => {
    if (!itemEditando || novaQuantidade <= 0) return;

    await db.runAsync('UPDATE itens SET quantidade = ? WHERE id = ?', novaQuantidade.toString(), itemEditando.id);
    setModalVisible(false);
    buscarItens();
  };

  const fecharModal = () => {
    setModalVisible(false);
    setItemEditando(null);
    setNomeItem('');
    setNovaQuantidade(0);
  };

  return (
    <View style={styles.container}>
      {/* Botão flutuante de "+" */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          setItemEditando(null);
          setModalVisible(true);
        }}
      >
        <FontAwesome name="plus" size={28} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.titulo}>Itens Cadastrados</Text>

      <FlatList
        data={itens}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <View>
              <Text style={styles.itemNome}>{item.nome}</Text>
              <Text>{item.quantidade} kg/litros</Text>
            </View>
            <View style={styles.botoes}>
              <TouchableOpacity onPress={() => iniciarEdicao(item)} style={styles.iconeBotao}>
                <FontAwesome name="pencil" size={28} color="blue" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deletarItem(item.id)} style={styles.iconeBotao}>
                <FontAwesome name="times" size={28} color="red" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Modal de adição/edição de item */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={fecharModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.titulo}>{itemEditando ? 'Editar Quantidade' : 'Adicionar Item'}</Text>

            {/* Campo nome apenas ao adicionar */}
            {!itemEditando && (
              <TextInput
                style={styles.input}
                placeholder="Nome do item"
                value={nomeItem}
                onChangeText={(text) => setNomeItem(text)}
              />
            )}

            <Text style={styles.titulo}>Quantidade (kg/litros)</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite a quantidade"
              value={novaQuantidade ? novaQuantidade.toString() : ''}
              onChangeText={(text) => setNovaQuantidade(parseFloat(text) || 0)}
              keyboardType="numeric"
            />

            <View style={styles.botoes}>
              <Button
                title={itemEditando ? 'Salvar' : 'Adicionar'}
                onPress={() => (itemEditando ? salvarEdicao() : adicionarItem())}
              />
              <Button title="Cancelar" color="red" onPress={fecharModal} />
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
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemNome: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  botoes: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconeBotao: {
    marginHorizontal: 10,
    padding: 8,
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
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    backgroundColor: '#007BFF',
    borderRadius: 50,
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    zIndex: 10,
  },
});
