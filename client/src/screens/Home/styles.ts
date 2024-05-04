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
  CaloriesUp:{
    backgroundColor: "#E89D57",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  boxText:{
    fontSize: THEME.FONT_SIZE.SM,
    fontFamily: THEME.FONT_FAMILY.BOLD,
    color: "#1B4F33",
    paddingVertical: 3,
  },
  boxTextDiv: {
    marginVertical: 3,
    width: "100%",
    justifyContent: "center",
    alignItems: "center"
  },
  Meals: {
    fontSize: THEME.FONT_SIZE.SM,
    fontFamily: THEME.FONT_FAMILY.BOLD,
    color: "#1B4F33",
    backgroundColor: "#E89D57",
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row"
  },
  SunriseImage: {
    width: "5%",
    objectFit: "contain",
    marginRight: 5,
    marginLeft: 5
  },
  PlusImage: {
   alignSelf: "flex-end",
   marginLeft: "auto",
   width: "4%",
   objectFit: "contain",
   marginRight: 5
  },
  MealBoxText: {
    fontSize: THEME.FONT_SIZE.SM,
    fontFamily: THEME.FONT_FAMILY.BOLD,
    color: "#1B4F33"
  },
  MealBoxIndex:{
    fontSize: THEME.FONT_SIZE.SM,
    fontFamily: THEME.FONT_FAMILY.BOLD,
    color: "#1B4F33",
    paddingVertical: 3,
    flexDirection: "row",
    justifyContent: "space-around"
  },
  MealBoxAll:{
    flexDirection: "column",
    gap: 20
  }
});
