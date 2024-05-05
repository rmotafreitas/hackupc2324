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

type Props = NativeStackScreenProps<RootStackParamList, "Login">;
export function Login() {
  const navigator = useNavigation();
  function goToRegisterScreen() {
    navigator.navigate("Register");
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
      password: formData.password,
    });
    console.log(res.data);
    if (res.data.error) {
      setError(res.data.error);
      setIsError(true);
    } else {
      await AsyncStorage.setItem("@user", JSON.stringify(res.data));
      await AsyncStorage.setItem("@token", res.data.access_token);
      userContext?.setUser(res.data);
      goToHome();
    }
    setIsLoading(false);
  }

  const [formData, setFormData] = useState<{
    email: string;
    password: string;
  }>({
    email: "",
    password: "",
  });

  const FORM_BUILDER_MAPPER = [
    {
      label: "Email",
      name: "email",
      input: {
        value: formData?.email,
        onChangeText: (text: string) =>
          setFormData({ ...formData, email: text }),
        placeholder: "Enter your email",
      },
      optional: false,
    },
    {
      label: "Password",
      name: "password",
      input: {
        secureTextEntry: true,
        value: formData?.password,
        onChangeText: (text: string) =>
          setFormData({ ...formData, password: text }),
        placeholder: "Enter your password",
        multiline: false,
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
                multiline={item.input.multiline}
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
              Login
            </Text>
          </TouchableOpacity>
          <View style={styles.center}>
            <Reference
              fn={goToRegisterScreen}
              label="No account? 🙈 Crete one!"
            />
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
