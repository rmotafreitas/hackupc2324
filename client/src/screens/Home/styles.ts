import { StyleSheet } from "react-native";
import { THEME } from "../../theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerApp: {
    minHeight: "100%",
    flexDirection: "column",
    alignItems: "center",
  },
  homeText: {
    color: THEME.COLORS.TEXT,
    fontFamily: THEME.FONT_FAMILY.BLACK,
    fontSize: THEME.FONT_SIZE.LG,
  },
  todayDiv:{
    width: 280,
    height: 40,
    borderColor: "#E89D57",
    borderWidth: 2,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center"
  },
  todayText:{
   fontSize: THEME.FONT_SIZE.LG,
   fontFamily: THEME.FONT_FAMILY.BOLD,
   color: "#1B4F33"
  },
  MenuImage:{
    
  }
});
