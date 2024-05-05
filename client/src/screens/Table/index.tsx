import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useCallback, useContext, useEffect } from "react";
import {
  ScrollView,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { api, userInterfaceType } from "../../api";
import { Background } from "../../components/Background";
import { UserContext } from "../../contexts/user.context";
import { RootStackParamList } from "../../routes/app.routes";
import { styles } from "./styles";
import { THEME } from "../../theme";
import PositiveRow from "../../assets/ArrowDown.png";
import NegativeRow from "../../assets/ArrowUp.png";
import UnfoldWhite from "../../assets/Group 7 (1).png";

export const getUserSavedDataOrNull = async () => {
  try {
    const userFromStorage = await AsyncStorage.getItem("@user");
    console.log("User from storage", userFromStorage);
    if (!userFromStorage) {
      return null;
    }
    const access_token = await AsyncStorage.getItem("@token");
    const userFromStorageTyped = JSON.parse(
      userFromStorage
    ) as userInterfaceType;
    const userFromDatabase = await api.post(
      "/me",
      {
        email: userFromStorageTyped.email,
      },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    // save the updated user data to storage
    await AsyncStorage.setItem("@user", JSON.stringify(userFromDatabase.data));
    return userFromDatabase.data;
  } catch (e) {
    return null;
  }
};

type Props = NativeStackScreenProps<RootStackParamList, "Table">;

export function Table({ route, navigation }: Props) {
  const navigator = useNavigation();

  const userContext = useContext(UserContext);

  useFocusEffect(
    useCallback(() => {
      getUserSavedDataOrNull().then((user) => {
        if (user) {
          userContext?.setUser(user);
        }
      });
    }, [route])
  );

  if (
    userContext === null ||
    userContext === undefined ||
    userContext.user === null
  ) {
    navigator.navigate("Login");
  }

  let arrayOfChanges = userContext?.user?.stats?.Weight.map((item, index) => {
    if (index === 0) {
      return 0;
    }
    return (
      item.weight - (userContext?.user?.stats?.Weight[index - 1]?.weight || 0)
    );
  });
  arrayOfChanges = arrayOfChanges?.reverse();
  return (
    <Background>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.containerApp}>
          <View
            style={{
              flexDirection: "column",
              width: "95%",
              borderWidth: 2,
              borderColor: THEME.COLORS.PRIMARY,
              marginTop: 10,
              borderBottomWidth: 0,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                padding: 10,
                borderBottomWidth: 2,
                borderBottomColor: THEME.COLORS.PRIMARY,
                backgroundColor: THEME.COLORS.PRIMARY,
                alignItems: "center",
              }}
            >
              <Image
                source={UnfoldWhite}
                style={{
                  width: 20,
                  height: 20,
                  objectFit: "contain",
                  alignSelf: "center",
                  tintColor: "transparent",
                }}
              />
              <Text
                style={{
                  textAlign: "center",
                  fontSize: THEME.FONT_SIZE.LG,
                  fontFamily: THEME.FONT_FAMILY.BOLD,
                }}
              >
                Weight
              </Text>
              <TouchableOpacity
                onPress={() => {
                  navigator.navigate("Home");
                }}
              >
                <Image
                  source={UnfoldWhite}
                  style={{
                    width: 20,
                    height: 20,
                    objectFit: "contain",
                    alignSelf: "center",
                    transform: [{ rotate: "180deg" }],
                  }}
                />
              </TouchableOpacity>
            </View>
            <FlatList
              data={userContext?.user?.stats.Weight}
              renderItem={({ item, index }) => {
                console.log("Item", item);
                console.log("Index", index);
                console.log("Array of changes", arrayOfChanges);
                const isHigherThanPrevious =
                  arrayOfChanges && arrayOfChanges[index] < 0;
                const isLastIndex =
                  // @ts-expect-error
                  index === userContext?.user?.stats.Weight.length - 1;
                return (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      padding: 10,
                      borderBottomWidth: 2,
                      borderBottomColor: THEME.COLORS.PRIMARY,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: THEME.FONT_SIZE.MD,
                        fontFamily: THEME.FONT_FAMILY.BOLD,
                      }}
                    >
                      {String(
                        new Date(item.time).toLocaleDateString().split("/")[0]
                      ).padStart(2, "0") +
                        "." +
                        String(
                          new Date(item.time).toLocaleDateString().split("/")[1]
                        ).padStart(2, "0")}
                    </Text>
                    {isHigherThanPrevious ? (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        {!isLastIndex && (
                          <Image
                            source={PositiveRow}
                            style={{
                              height: "100%",
                              objectFit: "contain",
                            }}
                          />
                        )}

                        <Text
                          style={{
                            fontSize: THEME.FONT_SIZE.MD,
                            fontFamily: THEME.FONT_FAMILY.BOLD,
                          }}
                        >
                          {item.weight.toFixed(1)} kg
                        </Text>
                      </View>
                    ) : (
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        {!isLastIndex && (
                          <Image
                            source={NegativeRow}
                            style={{
                              height: "100%",
                              objectFit: "contain",
                            }}
                          />
                        )}

                        <Text
                          style={{
                            fontSize: THEME.FONT_SIZE.MD,
                            fontFamily: THEME.FONT_FAMILY.BOLD,
                          }}
                        >
                          {item.weight.toFixed(1)} kg
                        </Text>
                      </View>
                    )}
                  </View>
                );
              }}
              keyExtractor={(item) => item.time}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Background>
  );
}
