import { Background } from "../../components/Background";
import {
  ScrollView,
  Text,
  TextInput,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./styles";
import { THEME } from "../../theme";
import { MaterialIcons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import { api } from "../../api";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../routes/app.routes";

type Props = NativeStackScreenProps<RootStackParamList, "Chat">;

export function Chat({ route, navigation }: Props) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]); // [message1, message2, ...
  const [token, setToken] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        setMessages([]);
        const t = await AsyncStorage.getItem("@token");
        if (t) {
          setToken(t);
        }
        api.get("/ai/chat").then((response) => {
          for (let i = response.data.length - 1; i >= 0; i--) {
            setMessages((old) => [...old, response.data[i].message]);
            setMessages((old) => [...old, response.data[i].chatGPT]);
          }
        });
      })();
    }, [route])
  );

  return (
    <Background>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.containerApp}>
          <View
            style={{
              flexDirection: "column",
              width: "95%",
              borderColor: THEME.COLORS.PRIMARY,
              marginTop: 10,
              borderBottomWidth: 0,
              flex: 1,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                marginVertical: 10,
                alignSelf: "center",
              }}
            >
              <MaterialIcons
                name="arrow-back"
                size={30}
                color={THEME.COLORS.TEXT}
                onPress={() => navigation.goBack()}
              />
              <Text
                style={{
                  color: THEME.COLORS.TEXT,
                  fontFamily: THEME.FONT_FAMILY.BOLD,
                  fontSize: THEME.FONT_SIZE.LG,
                  textAlign: "center",
                  marginVertical: 10,
                }}
              >
                NutriMate
              </Text>
              <MaterialIcons
                name="delete"
                size={30}
                color={THEME.COLORS.TEXT}
                onPress={async () => {
                  await api.delete("/ai/chat");
                  setMessages([]);
                }}
              />
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: "column",
              }}
            >
              {messages.map((message, index) => (
                <ChatBubble
                  key={index}
                  message={message}
                  isLeft={index % 2 !== 0}
                />
              ))}
              {isBotTyping && <ChatBubble message="Typing..." isLeft />}
            </View>
            <InputKeyboard
              message={message}
              setMessage={(message) => setMessage(message)}
              sendFunction={async () => {
                const myMessage = message;
                setMessage("");
                setMessages([...messages, myMessage]);
                setIsBotTyping(true);
                api
                  .post("/ai/chat/complete", {
                    prompt: message,
                  })
                  .then((response) => {
                    setIsBotTyping(false);
                    setMessages([...messages, myMessage, response.data]);
                    api.post("/ai/chat/save", {
                      promptText: myMessage,
                      resultText: response.data,
                    });
                  });
              }}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </Background>
  );
}

function InputKeyboard({
  message,
  setMessage,
  sendFunction,
}: {
  message: string;
  setMessage: (message: string) => void;
  sendFunction?: () => Promise<void>;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        marginVertical: 10,
        alignSelf: "center",
      }}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: THEME.COLORS.BACKGROUND_800,
          padding: 10,
          borderRadius: 10,
        }}
      >
        <TextInput
          style={{
            color: THEME.COLORS.TEXT,
            fontFamily: THEME.FONT_FAMILY.BOLD,
            borderColor: THEME.COLORS.PRIMARY,
            borderWidth: 2,
            paddingVertical: 5,
            paddingHorizontal: 10,
            borderRadius: 10,
          }}
          value={message}
          onChangeText={(text) => setMessage(text)}
          multiline
        />
      </View>
      <TouchableOpacity
        onPress={sendFunction}
        style={{
          backgroundColor: THEME.COLORS.PRIMARY,
          padding: 10,
          borderRadius: 10,
        }}
      >
        <MaterialIcons name="send" size={20} color={THEME.COLORS.WHITE_TEXT} />
      </TouchableOpacity>
    </View>
  );
}

export function ChatBubble({
  message,
  isLeft,
}: {
  message: string;
  isLeft: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: isLeft ? "flex-start" : "flex-end",
        marginVertical: 5,
      }}
    >
      <View
        style={{
          backgroundColor: isLeft ? "gray" : THEME.COLORS.PRIMARY,
          padding: 10,
          borderRadius: 10,
        }}
      >
        <Text
          style={{
            color: isLeft ? THEME.COLORS.WHITE_TEXT : THEME.COLORS.TEXT,
            fontFamily: THEME.FONT_FAMILY.BOLD,
          }}
        >
          {message}
        </Text>
      </View>
    </View>
  );
}
