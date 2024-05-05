import React, { useContext, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Modal,
  ModalProps,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { THEME } from "../../theme";
import { styles } from "./styles";
import CloseIcon from "../../assets/icons/SlideDownArrow.png";
import { UserContext } from "../../contexts/user.context";
import { SuccessContext } from "../../contexts/success.context";
import { ErrorContext } from "../../contexts/error.context";
import { api, caloriesPostResponse } from "../../api";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface Props extends ModalProps {
  handleClose: () => void;
  formData: caloriesPostResponse;
  foodType: "BREAKFAST" | "LUNCH" | "DINNER" | "OTHER";
  setFormData: (data: caloriesPostResponse) => void;
}

type Status = "idle" | "requesting";

export interface LabelProps {
  text: string;
  optional?: boolean;
}

export function Label({ text, optional }: LabelProps) {
  return (
    <Text style={styles.label}>
      {text}
      {optional && " (optional)"}:
    </Text>
  );
}

export interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  disabled?: boolean;
  multiline?: boolean;
  placeholder?: string;
  onEndEditing?: () => Promise<void>;
}

export function Input({
  value,
  onChangeText,
  disabled,
  placeholder,
  multiline,
  onEndEditing,
}: InputProps) {
  return (
    <TextInput
      style={[styles.input, disabled && styles.inputDisabled]}
      value={value}
      onChangeText={onChangeText}
      editable={!disabled}
      placeholder={placeholder}
      onEndEditing={onEndEditing}
    />
  );
}

export function CaloriesModal({
  handleClose,
  formData,
  setFormData,
  foodType,
  ...rest
}: Props) {
  const { successMessage, setSuccessMessage } = useContext(SuccessContext);
  const { errorMessage, setErrorMessage } = useContext(ErrorContext);

  const userContext = useContext(UserContext);

  const [tests, setTests] = useState(1);

  const FORM_BUILDER_MAPPER = [
    {
      label: "Name",
      name: "name",
      input: {
        value: formData?.name,
        onChangeText: (text: string) =>
          setFormData({ ...formData, name: text }),
        placeholder: "Enter the name of the food",
      },
    },
    {
      label: "Nutrition Value",
      name: "nutrionValue",
      input: {
        value: isNaN(formData?.nutrionValue)
          ? "0"
          : formData?.nutrionValue.toString(),
        onChangeText: (text: string) =>
          setFormData({ ...formData, nutrionValue: Number(text) }),
        placeholder: "Enter the nutrition value",
      },
    },
    {
      label: "Energy Value",
      name: "energyValue",
      input: {
        value: isNaN(formData?.energyValue)
          ? "0"
          : formData?.energyValue.toString(),
        onChangeText: (text: string) =>
          setFormData({ ...formData, energyValue: Number(text) }),
        placeholder: "Enter the energy value",
      },
    },
    {
      label: "Carbon Value",
      name: "carbonValue",
      input: {
        value: isNaN(formData?.carbonValue)
          ? "0"
          : formData?.carbonValue.toString(),
        onChangeText: (text: string) =>
          setFormData({ ...formData, carbonValue: Number(text) }),
        placeholder: "Enter the carbon value",
      },
    },
    {
      label: "Sugar Value",
      name: "sugarValue",
      input: {
        value: isNaN(formData?.sugarValue)
          ? ""
          : formData?.sugarValue.toString(),
        onChangeText: (text: string) =>
          setFormData({ ...formData, sugarValue: Number(text) }),
        placeholder: "Enter the sugar value",
      },
    },
    {
      label: "Protein Value",
      name: "proteinValue",
      input: {
        value: isNaN(formData?.proteinValue)
          ? ""
          : formData?.proteinValue.toString(),
        onChangeText: (text: string) =>
          setFormData({ ...formData, proteinValue: Number(text) }),
        placeholder: "Enter the protein value",
      },
    },
    {
      label: "Salt Value",
      name: "saltValue",
      optional: false,
      input: {
        value: isNaN(formData?.saltValue) ? "" : formData?.saltValue.toString(),
        onChangeText: (text: string) =>
          setFormData({ ...formData, saltValue: Number(text) }),
        placeholder: "Enter the salt value",
        multiline: false,
        onEndEditing: async () => {},
      },
    },
  ];

  return (
    <Modal animationType="slide" statusBarTranslucent transparent {...rest}>
      <KeyboardAvoidingView behavior="padding" style={styles.container}>
        <TouchableOpacity
          style={{
            height: "100%",
          }}
          onPress={handleClose}
        />
        <View style={styles.content}>
          <ScrollView
            contentContainerStyle={{
              alignItems: "center",
            }}
          >
            <TouchableOpacity style={styles.closeArea} onPress={handleClose}>
              <Image style={styles.closeAreaIcon} source={CloseIcon} />
            </TouchableOpacity>
            <View style={styles.waring}>
              <MaterialCommunityIcons name="alert" size={20} color="white" />
              <Text style={styles.waringText}>The values can be wrong!</Text>
            </View>
            <Text style={styles.title}>
              Check the values and click on "Eat!" to finish
            </Text>
            {FORM_BUILDER_MAPPER.map((item, index) => (
              <View
                style={{
                  width: "85%",
                }}
                key={index}
              >
                <Label text={item.label} optional={item.optional} />
                <Input
                  value={formData[
                    item.name as keyof typeof formData
                  ]?.toString()}
                  onChangeText={item.input.onChangeText}
                  placeholder={item.input.placeholder}
                  multiline={item.input.multiline}
                  onEndEditing={item.input.onEndEditing}
                  disabled={tests === 0}
                />
              </View>
            ))}
            {tests === 0 ? (
              <ActivityIndicator color={THEME.COLORS.WHITE_TEXT} />
            ) : (
              <TouchableOpacity
                onPress={() => {
                  for (const key in formData) {
                    // @ts-ignore
                    if (formData[key] === null || formData[key] === "") {
                      setErrorMessage("Please fill all the fields");
                      return;
                    }
                  }
                  api
                    .post("/eat", {
                      type: foodType,
                      name: formData.name,
                      photo: formData.photo,
                      nutrionValue: formData.nutrionValue,
                      energyValue: formData.energyValue,
                      carbonValue: formData.carbonValue,
                      sugarValue: formData.sugarValue,
                      proteinValue: formData.proteinValue,
                      saltValue: formData.saltValue,
                    })
                    .then((res) => {
                      setSuccessMessage("Food added successfully");
                      handleClose();
                    })
                    .catch((error) => {
                      console.error(error);
                      setErrorMessage("An error occurred");
                    });
                }}
                style={styles.okButton}
              >
                <Text style={styles.okText}>Eat! 🍗</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
