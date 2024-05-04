import React, { useState } from "react";
import { Button, Image, ScrollView, Text, View } from "react-native";
import { Background } from "../../components/Background";
import { styles } from "./styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList } from "../../routes/app.routes";
import * as ImagePicker from "expo-image-picker";

export const getUserSavedDataOrNull = async () => {
  try {
    const user = await AsyncStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch (e) {
    return null;
  }
};

type Props = NativeStackScreenProps<RootStackParamList, "UploadCalories">;

export function UploadCalories({ route, navigation }: Props) {
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <Background>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.containerApp}>
          <View>
            <Text style={styles.uploadCaloriesText}>
              Upload Calories Screen
            </Text>
            <Button
              title="Pick an image from camera roll"
              onPress={pickImage}
            />
            {image && (
              <Image source={{ uri: image }} style={styles.foodImage} />
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Background>
  );
}
