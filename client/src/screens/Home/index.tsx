import React, { useState } from "react";
import {
  Dimensions,
  Image,
  ImageSourcePropType,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Background } from "../../components/Background";
import { styles } from "./styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList } from "../../routes/app.routes";
import MenuImage from "./../../assets/menuButton.png";
import SearchImge from "./../../assets/Search.png";
import SunriseImage from "./../../assets/Sunrise.png";
import SunImage from "./../../assets/Sun.png";
import MoonImage from "./../../assets/Moon (1).png";
import PlusImage from "./../../assets/Plus.png";
import UnfoldImage from "./../../assets/Group 7.png";
import UnfoldWhiteImage from "./../../assets/Group 7 (1).png";
import { Ionicons } from "@expo/vector-icons";
import { THEME } from "../../theme";

function MyCheckbox() {
  const [checked, setChecked] = useState(false);
  return (
    <Pressable
      style={[styles.checkboxBase, checked && styles.checkboxChecked]}
      onPress={() => setChecked(!checked)}
    >
      {checked && (
        <Ionicons name="checkmark" size={20} color={THEME.COLORS.TEXT} />
      )}
    </Pressable>
  );
}

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
            <Image source={MenuImage} />
            <View style={styles.todayDiv}>
              <Text style={styles.todayText}>Today</Text>
            </View>
            <Image source={SearchImge} />
          </View>
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              paddingHorizontal: 10,
              marginBottom: 25,
            }}
          >
            <Stat label="Calories" value="0 / 1900" />
            <Stat label="Protein" value="0 / 85" />
            <Stat label="Carbs" value="0" />
            <Stat label="Fat" value="0" />
          </View>
          <View style={styles.MealBoxAll}>
            <Meals
              label="Breakfast"
              value1={0}
              value2={0}
              value3={0}
              value4={0}
              img={SunriseImage}
            />
            <Meals
              label="Lunch"
              value1={0}
              value2={0}
              value3={0}
              value4={0}
              img={SunImage}
            />
            <Meals
              label="Dinner"
              value1={0}
              value2={0}
              value3={0}
              value4={0}
              img={SunriseImage}
            />
            <Meals
              label="Other"
              value1={0}
              value2={0}
              value3={0}
              value4={0}
              img={MoonImage}
            />
          </View>
          <View>
            <View style={styles.ExtraUp}>
              <Extra label="Steps" value="14000 / 0" />
              <Extra label="Weight" img={PlusImage} />
            </View>
            <View style={styles.ExtraDown}>
              <Extra label="Training" img={PlusImage} />
              <Extra label="Period" check />
            </View>
          </View>
          <View
            style={{
              width: Dimensions.get("screen").width * 0.95,
              borderColor: "#E89D57",
              borderWidth: 2,
              borderRadius: 5,
            }}
          >
            <View style={styles.ProgressBox}>
              <Text style={styles.ProgressText}>Progress</Text>
              <Text style={styles.ProgressDate}>28.04-05.05</Text>
              <Image
                source={UnfoldWhiteImage}
                style={styles.UnfoldWhiteImage}
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Background>
  );
}

interface StatProps {
  label: string;
  value: string;
}

function Stat({ label, value }: StatProps) {
  return (
    <View
      style={{
        borderColor: "#E89D57",
        borderWidth: 2,
        borderRadius: 5,
        flex: 1,
      }}
    >
      <View style={styles.CaloriesUp}>
        <Text style={styles.boxText}>{label}</Text>
      </View>
      <View style={styles.boxTextDiv}>
        <Text style={styles.boxText}>{value}</Text>
      </View>
    </View>
  );
}

interface MealsBox {
  label: string;
  value1: number;
  value2: number;
  value3: number;
  value4: number;
  img: ImageSourcePropType;
}

function Meals({ label, value1, value2, value3, value4, img }: MealsBox) {
  return (
    <View
      style={{
        width: Dimensions.get("screen").width * 0.95,
        borderColor: "#E89D57",
        borderWidth: 2,
        borderRadius: 5,
      }}
    >
      <View style={styles.Meals}>
        <Image source={img} style={styles.SunriseImage} />
        <Text style={styles.boxText}>{label}</Text>
        <Image source={PlusImage} style={styles.PlusImage} />
      </View>
      <View style={styles.MealBoxIndex}>
        <Text style={styles.MealBoxText}>{value1}</Text>
        <Text style={styles.MealBoxText}>{value2}</Text>
        <Text style={styles.MealBoxText}>{value3}</Text>
        <Text style={styles.MealBoxText}>{value4}</Text>
      </View>
    </View>
  );
}

interface ExtraBox {
  label: string;
  value?: string;
  img?: ImageSourcePropType;
  check?: boolean;
}

function Extra({ label, value, img, check }: ExtraBox) {
  const [checkPeriod, setCheckPeriod] = useState<boolean>(false);

  const handleClickCheckPeriod = () => {
    setCheckPeriod(!checkPeriod);
  };

  return (
    <View
      style={{
        borderColor: "#E89D57",
        borderWidth: 2,
        borderRadius: 5,
      }}
    >
      <View style={styles.StepsUp}>
        <Text style={styles.StepsUpText}>{label}</Text>
        <Image source={UnfoldImage} style={styles.UnfoldImage} />
      </View>
      <View style={styles.StepsDown}>
        {value && <Text style={styles.boxText}>{value}</Text>}
        {img && <Image source={img} style={styles.PlusImage2} />}
        {check && <MyCheckbox />}
      </View>
    </View>
  );
}
