import { StyleSheet } from "react-native";
import { THEME } from "../../theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: THEME.COLORS.OVERLAY,
  },
  content: {
    width: "100%",
    backgroundColor: THEME.COLORS.PRIMARY,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    marginTop: "auto",
  },
  closeArea: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
    height: 35,
    alignItems: "center",
  },
  closeAreaIcon: {
    height: 14,
    resizeMode: "contain",
  },
  title: {
    color: THEME.COLORS.WHITE_TEXT,
    fontFamily: THEME.FONT_FAMILY.BOLD,
    fontSize: THEME.FONT_SIZE.SM,
    textAlign: "center",
    width: "100%",
  },
  waring: {
    width: "88%",
    marginBottom: 10,
    backgroundColor: THEME.COLORS.COVER,
    borderRadius: 8,
    padding: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  waringText: {
    color: THEME.COLORS.WHITE_TEXT,
    fontFamily: THEME.FONT_FAMILY.BOLD,
    fontSize: THEME.FONT_SIZE.SM,
    textAlign: "center",
  },
  label: {
    color: THEME.COLORS.WHITE_TEXT,
    fontFamily: THEME.FONT_FAMILY.BOLD,
    fontSize: THEME.FONT_SIZE.SM,
    textAlign: "left",
    width: "100%",
  },
  input: {
    color: THEME.COLORS.TEXT,
    backgroundColor: THEME.COLORS.WHITE_TEXT,
    textAlign: "left",
    paddingVertical: 5,
    paddingHorizontal: 10,
    width: "100%",
    borderRadius: 8,
  },
  inputDisabled: {
    opacity: 0.5,
  },
  okButton: {
    marginVertical: 10,
    backgroundColor: THEME.COLORS.SHAPE,
    padding: 10,
    borderRadius: 8,
    width: "85%",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  okText: {
    color: THEME.COLORS.WHITE_TEXT,
    fontFamily: THEME.FONT_FAMILY.BOLD,
    fontSize: THEME.FONT_SIZE.SM,
  },
});
