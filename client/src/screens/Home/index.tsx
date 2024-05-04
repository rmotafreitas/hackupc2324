import React from "react";
import { ScrollView, Text, View } from "react-native";
import { Background } from "../../components/Background";
import { styles } from "./styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList } from "../../routes/app.routes";

export const getUserSavedDataOrNull = async () => {
  try {
    const user = await AsyncStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch (e) {
    return null;
  }
};

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export function Home({ route, navigation }: Props) {
  return (
    <Background>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.containerApp}>
          <View>
            <Text style={styles.homeText}>Home Screen</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Background>
  );
}
