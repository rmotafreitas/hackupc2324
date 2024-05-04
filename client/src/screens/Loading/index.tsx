import { ActivityIndicator, ImageBackground, View } from "react-native";
import { THEME } from "../../theme";
import { styles } from "./styles";
import { SafeAreaView } from "react-native-safe-area-context";

export function Loading() {
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          flex: 1,
          flexDirection: "column-reverse",
          paddingBottom: "40%",
        }}
      >
        <ActivityIndicator color={THEME.COLORS.WHITE_TEXT} />
      </View>
    </SafeAreaView>
  );
}
