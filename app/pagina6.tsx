import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  ListRenderItem,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Tipagem da dica
type Dica = {
  id: string;
  titulo: string;
  texto: string;
  icone: keyof typeof Ionicons.glyphMap;
};

const dicas: Dica[] = [
  {
    id: "1",
    titulo: "Preparo do Solo",
    texto: "Antes de iniciar qualquer plantio, é essencial realizar uma análise detalhada do solo. Essa análise identifica a acidez, os níveis de nutrientes e a textura, possibilitando a correção adequada. Caso o pH esteja desequilibrado, pode-se aplicar calcário para neutralizar a acidez. Um solo bem preparado garante maior aproveitamento de fertilizantes e melhora o desenvolvimento das raízes. O preparo adequado do solo é a base para uma lavoura produtiva e saudável.",
    icone: "leaf",
  },
  {
    id: "2",
    titulo: "Rotação de Culturas",
    texto: "A prática da rotação de culturas é uma técnica sustentável que evita o esgotamento do solo. Alternar o plantio entre leguminosas, gramíneas e outras culturas melhora a estrutura do solo, reduz a incidência de pragas e doenças e aumenta a biodiversidade. Além disso, algumas culturas, como o feijão e a soja, fixam nitrogênio no solo, reduzindo a necessidade de adubação química. A rotação também melhora a infiltração de água e ajuda no controle da erosão.",
    icone: "repeat",
  },
  {
    id: "3",
    titulo: "Irrigação Eficiente",
    texto: "Adotar sistemas de irrigação por gotejamento ou microaspersão é uma forma inteligente de economizar água. Esse tipo de irrigação direciona a água diretamente às raízes, evitando desperdícios por evaporação ou escorrimento. Também é possível automatizar o sistema para aplicar água no melhor horário, como de madrugada. Monitorar a umidade do solo com sensores garante que a planta receba a quantidade exata de água. Uma irrigação bem planejada resulta em economia e aumento da produtividade.",
    icone: "water",
  },
  {
    id: "4",
    titulo: "Controle de Pragas Integrado",
    texto: "O controle de pragas não deve se basear apenas no uso de defensivos agrícolas. A abordagem mais eficiente é o Manejo Integrado de Pragas (MIP), que combina diferentes métodos: culturais, biológicos, químicos e mecânicos. Monitorar as lavouras regularmente ajuda a identificar focos iniciais e aplicar medidas preventivas. O uso consciente e alternado de inseticidas evita a resistência das pragas. Sempre que possível, dê preferência a defensivos biológicos ou menos tóxicos.",
    icone: "bug",
  },
  {
    id: "5",
    titulo: "Adubação de Precisão",
    texto: "A aplicação correta de fertilizantes é fundamental para o sucesso da lavoura. A adubação deve ser feita com base na análise de solo e nas necessidades específicas da cultura. Usar adubação de precisão, com o auxílio de mapas e GPS, evita desperdícios e contaminações. Fertilizantes aplicados em excesso podem causar danos às plantas e ao meio ambiente. Utilize também matéria orgânica, como esterco curtido e composto, para enriquecer o solo de forma sustentável.",
    icone: "analytics",
  },
  {
    id: "6",
    titulo: "Escolha de Sementes Certificadas",
    texto: "Utilizar sementes certificadas garante maior pureza genética, vigor e resistência a pragas e doenças. Essas sementes passam por testes rigorosos de qualidade e germinação. Sempre compre sementes de fornecedores confiáveis e verifique a validade e o armazenamento. Prefira variedades adaptadas à sua região e ao tipo de solo. O uso de sementes de baixa qualidade pode comprometer todo o ciclo da cultura e reduzir a produtividade.",
    icone: "barcode",
  },
  {
    id: "7",
    titulo: "Plantio no Período Ideal",
    texto: "O calendário agrícola deve ser seguido com rigor para aproveitar melhor as condições climáticas. Plantar fora do período ideal pode expor as lavouras a secas, chuvas intensas ou geadas. Consulte fontes confiáveis, como o zoneamento agrícola e a previsão do tempo, para planejar o melhor momento. Respeitar o período certo também favorece o controle de pragas e o uso racional de insumos. Um plantio bem programado garante maior eficiência e segurança na produção.",
    icone: "calendar",
  },
  {
    id: "8",
    titulo: "Cobertura do Solo",
    texto: "A cobertura vegetal ou palhada protege o solo contra a erosão, a perda de nutrientes e a compactação. Pode-se usar palha de milho, trigo, ou mesmo plantas de cobertura como braquiária ou mucuna. Essa prática mantém a umidade do solo, reduz a necessidade de irrigação e evita o crescimento de plantas daninhas. A cobertura também favorece a atividade biológica do solo, melhorando sua estrutura e fertilidade ao longo do tempo.",
    icone: "layers",
  },
  {
    id: "9",
    titulo: "Manejo de Doenças",
    texto: "As doenças de plantas devem ser identificadas precocemente para evitar perdas. O uso de cultivares resistentes, rotação de culturas, e eliminação de restos de culturas infectadas são medidas eficazes. Fungicidas devem ser usados de forma planejada e, preferencialmente, alternados para evitar resistência. Inspeções frequentes ajudam a detectar manchas, murchas ou deformações que indicam doenças. Manter o ambiente equilibrado é uma forma eficiente de prevenção.",
    icone: "medkit",
  },
  {
    id: "10",
    titulo: "Sustentabilidade na Propriedade",
    texto: "Adotar práticas sustentáveis reduz os impactos ambientais e melhora a imagem do produtor. Entre as ações estão: reaproveitamento da água, compostagem de resíduos, uso de energia solar e proteção de nascentes. É importante também manter áreas de preservação permanentes (APPs) e respeitar as normas ambientais. A sustentabilidade também passa pela valorização do trabalhador rural e pela adoção de boas práticas de produção.",
    icone: "earth",
  },
  {
    id: "11",
    titulo: "Calagem Correta",
    texto: "A aplicação de calcário é essencial para corrigir a acidez do solo. Um solo ácido reduz a disponibilidade de nutrientes e prejudica o desenvolvimento das raízes. A calagem deve ser feita com base na análise do solo e com antecedência de pelo menos 60 dias do plantio. Existem diferentes tipos de calcário (dolomítico, calcítico), cada um com indicações específicas. A dose e a incorporação correta garantem melhores resultados na produtividade.",
    icone: "construct",
  },
  {
    id: "12",
    titulo: "Compostagem e Adubos Orgânicos",
    texto: "Produzir compostagem com resíduos vegetais, esterco e restos de cultura é uma forma barata e eficaz de adubar o solo. Esse material orgânico melhora a estrutura do solo, aumenta a retenção de água e estimula a vida microbiana. Adubos orgânicos são menos agressivos ao meio ambiente e promovem uma fertilização mais equilibrada. A compostagem também contribui para o reaproveitamento de resíduos e redução de custos na propriedade.",
    icone: "nutrition",
  },
  {
    id: "13",
    titulo: "Monitoramento Climático",
    texto: "Acompanhar as condições climáticas em tempo real ajuda na tomada de decisões como irrigação, colheita e aplicação de defensivos. Hoje existem sensores e aplicativos que fornecem dados precisos sobre temperatura, umidade e chuva. Com essas informações, o produtor pode agir preventivamente e evitar perdas. Conhecer o histórico climático da região também auxilia no planejamento das safras. Clima e agricultura andam juntos.",
    icone: "cloudy",
  },
  {
    id: "14",
    titulo: "Boas Práticas na Colheita",
    texto: "Colher no momento certo e com o equipamento adequado é fundamental para evitar perdas. Uma colheita antecipada pode comprometer a qualidade do produto, enquanto uma tardia pode causar queda de grãos e deterioração. É essencial calibrar máquinas colhedoras, manter as lâminas afiadas e ajustar a velocidade. O armazenamento pós-colheita também exige atenção para evitar fungos e pragas. A colheita é a etapa onde todo o esforço precisa ser bem aproveitado.",
    icone: "basket",
  },
  {
    id: "15",
    titulo: "Uso Racional de Defensivos",
    texto: "O uso de agroquímicos deve seguir critérios técnicos e sempre com Equipamentos de Proteção Individual (EPIs). A aplicação deve ser feita em horários mais frescos do dia, com pouco vento, para evitar deriva. Armazene os produtos em local seguro, longe de pessoas e animais. Sempre leia o rótulo e siga a dosagem recomendada. O uso consciente protege a saúde do agricultor, do consumidor e do meio ambiente.",
    icone: "warning",
  },
  {
    id: "16",
    titulo: "Capacitação Contínua",
    texto: "Buscar atualização constante sobre novas tecnologias, técnicas de manejo e boas práticas é um diferencial competitivo. Participe de cursos, dias de campo e eventos do setor. Conhecimento aplicado melhora a produtividade e reduz custos. A troca de experiências com outros produtores também é uma fonte rica de aprendizado. Um agricultor bem informado toma decisões mais seguras e sustentáveis.",
    icone: "school",
  },
  {
    id: "17",
    titulo: "Tecnologia no Campo",
    texto: "A agricultura moderna conta com diversas ferramentas digitais que facilitam o manejo e aumentam a eficiência. Aplicativos, drones, sensores e softwares de gestão ajudam no controle da produção. Sistemas GPS orientam plantio e adubação de forma precisa. A tecnologia também permite o acompanhamento remoto da lavoura e a tomada de decisões baseada em dados reais. Integrar inovação à prática rural é o futuro da agricultura.",
    icone: "hardware-chip",
  },
  {
    id: "18",
    titulo: "Planejamento da Produção",
    texto: "Um bom planejamento agrícola envolve definir metas, escolher as culturas mais rentáveis, prever custos e organizar o cronograma de atividades. Essa organização permite aproveitar melhor os recursos e evitar imprevistos. Planejar também ajuda a identificar gargalos e melhorar a rentabilidade da propriedade. Utilize planilhas ou softwares de gestão rural para ter maior controle.",
    icone: "clipboard",
  },
  {
    id: "19",
    titulo: "Conservação da Água",
    texto: "Além da irrigação eficiente, é importante cuidar das nascentes e evitar o assoreamento de rios e córregos. Construir curvas de nível, caixas de contenção e manter vegetação nativa nas margens são práticas recomendadas. Reutilizar água da chuva para irrigação também é uma excelente alternativa. A água é um recurso vital e escasso, e deve ser usado com responsabilidade.",
    icone: "water-outline",
  },
  {
    id: "20",
    titulo: "Bem-estar Animal",
    texto: "Em propriedades com criação, é essencial garantir boas condições de manejo, alimentação e sanidade dos animais. O bem-estar animal impacta diretamente na produtividade e na qualidade dos produtos como leite, carne e ovos. Mantenha as instalações limpas, espaços adequados e forneça água de qualidade. O manejo humanizado evita estresse e reduz o uso de medicamentos.",
    icone: "paw",
  },
];

export default function Pagina6() {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [dicaSelecionada, setDicaSelecionada] = useState<Dica | null>(null);

  const abrirModal = (item: Dica) => {
    setDicaSelecionada(item);
    setModalVisible(true);
  };

  const renderItem: ListRenderItem<Dica> = ({ item }) => (
    <TouchableOpacity style={styles.item} onPress={() => abrirModal(item)}>
      <Ionicons name={item.icone} size={28} color="#4CAF50" style={styles.icon} />
      <Text style={styles.itemText}>{item.titulo}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dicas para Agricultores</Text>
      <FlatList data={dicas} keyExtractor={(item) => item.id} renderItem={renderItem} />

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{dicaSelecionada?.titulo}</Text>
            <Text style={styles.modalText}>{dicaSelecionada?.texto}</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#F0F0F0",
    marginBottom: 10,
  },
  icon: {
    marginRight: 15,
  },
  itemText: {
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    margin: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 26,
    textAlign: "left",
    marginBottom: 20,
  },
  modalButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#4CAF50",
    borderRadius: 5,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
