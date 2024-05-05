import React, { useContext, useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { api } from "../../api";
import { Background } from "../../components/Background";
import { styles } from "./styles";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Input, Label } from "../../components/CaloriesModal";
import { UserContext } from "../../contexts/user.context";
import { Loading } from "../Loading";
import { THEME } from "../../theme";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes/app.routes";

type Props = NativeStackScreenProps<RootStackParamList, "Register">;
export function Update() {
  const navigator = useNavigation();

  function goToLoginScreen() {
    navigator.navigate("Login");
  }

  function goToHome() {
    navigator.navigate("Home");
  }

  const [isError, setIsError] = useState(false);
  const [error, setError] = useState("");

  const userContext = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin() {
    setIsLoading(true);
    const res = await api.post("/me", {
      email: formData.email,
      name: formData.name,
      nutrionValue: formData.nutrionValue,
      energyValue: formData.energyValue,
      carbonValue: formData.carbonValue,
      sugarValue: formData.sugarValue,
      proteinValue: formData.proteinValue,
      saltValue: formData.saltValue,
    });
    if (res.data.error) {
      setError(res.data.error);
      setIsError(true);
    } else {
      await AsyncStorage.setItem("@user", JSON.stringify(res.data));
      userContext?.setUser(res.data);
      goToHome();
    }
    setIsLoading(false);
  }

  const [formData, setFormData] = useState<{
    email: string;
    name: string;
    nutrionValue: number;
    energyValue: number;
    carbonValue: number;
    sugarValue: number;
    proteinValue: number;
    saltValue: number;
  }>({
    email: userContext?.user?.email || "",
    name: userContext?.user?.name || "",
    nutrionValue: userContext?.user?.nutrionValue || 0,
    energyValue: userContext?.user?.energyValue || 0,
    carbonValue: userContext?.user?.carbonValue || 0,
    sugarValue: userContext?.user?.sugarValue || 0,
    proteinValue: userContext?.user?.proteinValue || 0,
    saltValue: userContext?.user?.saltValue || 0,
  });

  const FORM_BUILDER_MAPPER = [
    {
      label: "Name",
      name: "name",
      input: {
        value: formData?.email,
        onChangeText: (text: string) =>
          setFormData({ ...formData, name: text }),
        placeholder: "Enter your name",
      },
      optional: false,
    },
    {
      label: "Nutrion Value",
      name: "nutrionValue",
      input: {
        value: formData?.nutrionValue.toString(),
        onChangeText: (text: string) =>
          setFormData({ ...formData, nutrionValue: parseInt(text) }),
        placeholder: "Enter your nutrion value",
      },
      optional: false,
    },
    {
      label: "Energy Value",
      name: "energyValue",
      input: {
        value: formData?.energyValue.toString(),
        onChangeText: (text: string) =>
          setFormData({ ...formData, energyValue: parseInt(text) }),
        placeholder: "Enter your energy value",
      },
      optional: false,
    },
    {
      label: "Carbon Value",
      name: "carbonValue",
      input: {
        value: formData?.carbonValue.toString(),
        onChangeText: (text: string) =>
          setFormData({ ...formData, carbonValue: parseInt(text) }),
        placeholder: "Enter your carbon value",
      },
      optional: false,
    },
    {
      label: "Sugar Value",
      name: "sugarValue",
      input: {
        value: formData?.sugarValue.toString(),
        onChangeText: (text: string) =>
          setFormData({ ...formData, sugarValue: parseInt(text) }),
        placeholder: "Enter your sugar value",
      },
      optional: false,
    },
    {
      label: "Protein Value",
      name: "proteinValue",
      input: {
        value: formData?.proteinValue.toString(),
        onChangeText: (text: string) =>
          setFormData({ ...formData, proteinValue: parseInt(text) }),
        placeholder: "Enter your protein value",
      },
      optional: false,
    },
    {
      label: "Salt Value",
      name: "saltValue",
      input: {
        value: formData?.saltValue.toString(),
        onChangeText: (text: string) =>
          setFormData({ ...formData, saltValue: parseInt(text) }),
        placeholder: "Enter your salt value",
      },
      optional: false,
    },
  ];

  return !isLoading ? (
    <Background>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.containerApp}>
          <Text style={styles.loginText}>NutriMate 🤖</Text>
          {FORM_BUILDER_MAPPER.map((item, index) => (
            <View
              style={{
                width: "85%",
              }}
              key={index}
            >
              <Label text={item.label} optional={item.optional} />
              <Input
                value={formData[item.name as keyof typeof formData]?.toString()}
                onChangeText={item.input.onChangeText}
                placeholder={item.input.placeholder}
              />
            </View>
          ))}
          <TouchableOpacity
            style={{
              backgroundColor: THEME.COLORS.PRIMARY,
              padding: 10,
              borderRadius: 5,
              width: "85%",
              alignItems: "center",
              marginTop: 20,
            }}
            onPress={handleLogin}
          >
            <Text
              style={{
                color: THEME.COLORS.WHITE_TEXT,
                fontFamily: THEME.FONT_FAMILY.SEMI_BOLD,
              }}
            >
              Update
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: THEME.COLORS.PRIMARY,
              padding: 10,
              borderRadius: 5,
              width: "85%",
              alignItems: "center",
              marginTop: 20,
            }}
            onPress={() => {
              AsyncStorage.removeItem("@user");
              userContext?.setUser(null);
              goToLoginScreen();
            }}
          >
            <Text
              style={{
                color: THEME.COLORS.WHITE_TEXT,
                fontFamily: THEME.FONT_FAMILY.SEMI_BOLD,
              }}
            >
              Logout
            </Text>
          </TouchableOpacity>
          <View style={styles.center}>
            <Reference fn={goToHome} label="Go back to home screen 🫂" />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Background>
  ) : (
    <Loading />
  );
}

export function Reference({ fn, label }: { fn: () => void; label: string }) {
  return (
    <Text
      style={{
        color: THEME.COLORS.OVERLAY,
        fontFamily: THEME.FONT_FAMILY.SEMI_BOLD,
        textDecorationLine: "underline",
        fontSize: 16,
        marginTop: 10,
      }}
      onPress={fn}
    >
      {label}
    </Text>
  );
}
