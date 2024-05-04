import { StyleSheet } from "react-native";
import { THEME } from "../../theme/index";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerApp: {
    minHeight: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  loginText: {
    fontSize: THEME.FONT_SIZE.LG,
    fontFamily: THEME.FONT_FAMILY.BOLD,
  },
  loginCenter: {
    justifyContent: "center",
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
  },
});
