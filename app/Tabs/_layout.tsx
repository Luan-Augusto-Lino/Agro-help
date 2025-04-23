import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
        }}
      />
      <Tabs.Screen
        name="sobre"
        options={{
          title: "Sobre",
        }}
      />
    </Tabs>
  );
}
