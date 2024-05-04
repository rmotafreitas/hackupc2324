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
    color: THEME.COLORS.TEXT
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
    gap: 15,
    marginBottom: 25
  },
  StepsUp: {
    marginVertical: 3,
    marginHorizontal: 5,
    width: 160,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  StepsDown: {
    backgroundColor: "#E89D57",
    justifyContent: "center",
    alignItems: "center",
    height: 25,
  },
  StepsUpText: {
    fontSize: THEME.FONT_SIZE.SM,
    fontFamily: THEME.FONT_FAMILY.BOLD,
    color: "#1B4F33",
    paddingVertical: 3,
    textAlign: "center",
    flex: 1,
  },
  UnfoldImage: {
    alignSelf: "flex-end",
    marginLeft: "auto",
    objectFit: "contain",
    marginRight: 5,
    marginBottom: 3,
  },
  ExtraUp: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 15
  },
  ExtraDown: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 20
  },
  PlusImage2: {
    width: "10%",
    objectFit: "contain"
  },
  checkboxBase: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: 'white',
  },
  checkboxChecked: {
    backgroundColor: 'white',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "center"
  },
  UnfoldWhiteImage: {
    alignSelf: "flex-end",
    marginLeft: "auto",
    objectFit: "contain",
    marginRight: 7,
    marginBottom: 14,
  },
  ProgressBox: {
    fontSize: THEME.FONT_SIZE.SM,
    fontFamily: THEME.FONT_FAMILY.BOLD,
    color: "#1B4F33",
    backgroundColor: "#E89D57",
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
    flexDirection: "row",
    height: "25%"
  },
  ProgressText: {
    fontSize: THEME.FONT_SIZE.SM,
    fontFamily: THEME.FONT_FAMILY.BOLD,
    color: THEME.COLORS.TEXT,
    marginLeft: 50,
    flex: 1
  },
  ProgressDate:{
    fontSize: THEME.FONT_SIZE.SM,
    fontFamily: THEME.FONT_FAMILY.BOLD,
    color: THEME.COLORS.TEXT,
    alignSelf: "flex-end",
    marginLeft: "auto",
    objectFit: "contain",
    marginRight: 30,
    marginBottom: 10,
  }

});
