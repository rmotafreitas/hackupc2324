import { StyleSheet } from "react-native";
import { THEME } from "../../theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerApp: {
    minHeight: "100%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  uploadCaloriesText: {
    color: THEME.COLORS.TEXT,
    fontFamily: THEME.FONT_FAMILY.BLACK,
    fontSize: THEME.FONT_SIZE.LG,
  },
  foodImage: {
    width: 200,
    height: 200,
  },
});
