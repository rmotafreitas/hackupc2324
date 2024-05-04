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
import { caloriesPostResponse } from "../../api";

interface Props extends ModalProps {
  handleClose: () => void;
  formData: caloriesPostResponse;
  setFormData: (data: caloriesPostResponse) => void;
}

type Status = "idle" | "requesting";

interface LabelProps {
  text: string;
  optional?: boolean;
}

function Label({ text, optional }: LabelProps) {
  return (
    <Text style={styles.label}>
      {text}
      {optional && " (optional)"}:
    </Text>
  );
}

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  disabled?: boolean;
  multiline?: boolean;
  placeholder?: string;
  onEndEditing?: () => Promise<void>;
}

function Input({
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
  ...rest
}: Props) {
  const { successMessage, setSuccessMessage } = useContext(SuccessContext);
  const { errorMessage, setErrorMessage } = useContext(ErrorContext);

  const userContext = useContext(UserContext);

  const [tests, setTests] = useState(1);

  const FORM_BUILDER_MAPPER = [
    {
      label: "Nutrition Value",
      name: "nutrionValue",
      input: {
        value: formData?.nutrionValue,
        onChangeText: (text: string) =>
          setFormData({ ...formData, nutrionValue: Number(text) }),
        placeholder: "Enter the nutrition value",
      },
    },
    {
      label: "Energy Value",
      name: "energyValue",
      input: {
        value: formData?.energyValue,
        onChangeText: (text: string) =>
          setFormData({ ...formData, energyValue: Number(text) }),
        placeholder: "Enter the energy value",
      },
    },
    {
      label: "Carbon Value",
      name: "carbonValue",
      input: {
        value: formData?.carbonValue,
        onChangeText: (text: string) =>
          setFormData({ ...formData, carbonValue: Number(text) }),
        placeholder: "Enter the carbon value",
      },
    },
    {
      label: "Sugar Value",
      name: "sugarValue",
      input: {
        value: "",
        onChangeText: (text: string) =>
          setFormData({ ...formData, sugarValue: Number(text) }),
        placeholder: "Enter the sugar value",
      },
    },
    {
      label: "Protein Value",
      name: "proteinValue",
      input: {
        value: formData?.proteinValue,
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
        value: formData?.saltValue,
        onChangeText: (text: string) =>
          setFormData({ ...formData, saltValue: Number(text) }),
        placeholder: "Enter the salt value",
        multiline: false,
        onEndEditing: async () => {},
      },
    },
  ];

  console.log(formData);

  return (
    <Modal
      animationType="slide"
      statusBarTranslucent
      transparent
      {...rest}
      visible={true}
    >
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
            <Text style={styles.title}>
              Check the values and click on "Done" to finish
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
              <TouchableOpacity onPress={() => {}} style={styles.okButton}>
                <Text style={styles.okText}>Done</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}