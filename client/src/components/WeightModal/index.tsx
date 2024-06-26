import React, { useContext, useState } from "react";
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
import { api } from "../../api";
import CloseIcon from "../../assets/icons/SlideDownArrow.png";
import { ErrorContext } from "../../contexts/error.context";
import { SuccessContext } from "../../contexts/success.context";
import { UserContext } from "../../contexts/user.context";
import { THEME } from "../../theme";
import { styles } from "./styles";

interface Props extends ModalProps {
  handleClose: () => void;
  weight: number;
  date: string;
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

export function WeightModal({ handleClose, weight, date, ...rest }: Props) {
  const { successMessage, setSuccessMessage } = useContext(SuccessContext);
  const { errorMessage, setErrorMessage } = useContext(ErrorContext);

  const userContext = useContext(UserContext);

  const [tests, setTests] = useState(1);
  const [formData, setFormData] = useState<number>(weight);

  const FORM_BUILDER_MAPPER = [
    {
      label: "Weight (kg)",
      name: "weight",
      input: {
        value: formData,
        onChangeText: (text: string) =>
          setFormData(parseFloat(text.replace(/[^0-9.]/g, ""))),
        placeholder: "Enter your daily weight in kg",
        multiline: false,
      },
      optional: false,
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
            <Text style={styles.title}>
              Enter your daily weight to track your progress
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
                  disabled={tests === 0}
                />
              </View>
            ))}
            {tests === 0 ? (
              <ActivityIndicator color={THEME.COLORS.WHITE_TEXT} />
            ) : (
              <TouchableOpacity
                onPress={() => {
                  if (!weight) {
                    setErrorMessage("Please fill all the fields");
                    return;
                  }
                  api
                    .post("/weight", {
                      weight: formData,
                      date: date,
                    })
                    .then((res) => {
                      setSuccessMessage("Weight added successfully");
                      handleClose();
                    })
                    .catch((error) => {
                      console.error(error);
                      setErrorMessage("An error occurred");
                    });
                }}
                style={styles.okButton}
              >
                <Text style={styles.okText}>Done! 🤸</Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
