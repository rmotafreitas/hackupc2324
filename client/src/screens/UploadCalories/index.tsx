import React, { useState } from "react";
import { Button, Image, ScrollView, Text, View } from "react-native";
import { Background } from "../../components/Background";
import { styles } from "./styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";
import { RootStackParamList } from "../../routes/app.routes";
import * as ImagePicker from "expo-image-picker";
import { api, caloriesPostResponse } from "../../api";
import { CaloriesModal } from "../../components/CaloriesModal";

export const getUserSavedDataOrNull = async () => {
  try {
    const user = await AsyncStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch (e) {
    return null;
  }
};

const createFileImageObject = (file: string) => {
  let uriParts = file.split(".");
  let fileType = uriParts[uriParts.length - 1];
  return {
    uri: file,
    name: `photo.${fileType}`,
    type: `file/${fileType}`,
  };
};

type Props = NativeStackScreenProps<RootStackParamList, "UploadCalories">;
export function UploadCalories({ route, navigation }: Props) {
  console.log("Props", route.params);

  const [image, setImage] = useState<string | null>(null);
  const [isCaloriesModalVisible, setIsCaloriesModalVisible] = useState(false);

  const [formData, setFormData] = useState<caloriesPostResponse>(
    {} as caloriesPostResponse
  );

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const imageSelected = result;
      setImage(imageSelected.assets[0].uri);
      const formDataToPost = new FormData();
      const imageObject = createFileImageObject(imageSelected.assets[0].uri);
      formDataToPost.append("image", imageObject as any);
      let res = await api.post("/calories", formDataToPost, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      let calories: caloriesPostResponse = res.data;
      if (!calories) {
        calories = {
          name: "",
          photo: "",
          nutrionValue: 0,
          energyValue: 0,
          carbonValue: 0,
          sugarValue: 0,
          proteinValue: 0,
          saltValue: 0,
        };
      }
      setFormData(calories);
      setIsCaloriesModalVisible(true);
      console.log(calories);
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
            <CaloriesModal
              foodType={route.params.foodType}
              visible={isCaloriesModalVisible}
              handleClose={() => {
                setIsCaloriesModalVisible(false);
                setImage(null);
              }}
              formData={formData}
              setFormData={setFormData}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Background>
  );
}
