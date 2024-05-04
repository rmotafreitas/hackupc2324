import React from "react";
import { Image, ScrollView, Text, View } from "react-native";
import { Background } from "../../components/Background";
import { styles } from "./styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList } from "../../routes/app.routes";
import MenuImage from "./../../assets/menuButton.png";
import SearchImge from "./../../assets/Search.png";

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
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              marginBottom: 20,
            }}
          >
            <Image source={MenuImage} style={styles.MenuImage} />
            <View style={styles.todayDiv}>
              <Text style={styles.todayText}>Today</Text>
            </View>
            <Image source={SearchImge} style={styles.MenuImage} />
          </View>
          <View>
            <Stat />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Background>
  );
}

function Stat() {
  return (
    <View
      style={{
        borderColor: "#E89D57",
        borderWidth: 2,
        borderRadius: 5,
        paddingHorizontal: 15,
        paddingVertical: 5,
      }}
    >
      <View>
        <Text>Calories</Text>
      </View>
      <View>
        <Text>0 / 1900</Text>
      </View>
    </View>
  );
}
