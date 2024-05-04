import { ActivityIndicator, ImageBackground, View } from "react-native";
import { THEME } from "../../theme";
import { styles } from "./styles";
import { SafeAreaView } from "react-native-safe-area-context";

export function Loading() {
  return (
    <SafeAreaView style={styles.container}>
      <ActivityIndicator size={THEME.FONT_SIZE.LG} color={THEME.COLORS.SHAPE} />
    </SafeAreaView>
  );
}
