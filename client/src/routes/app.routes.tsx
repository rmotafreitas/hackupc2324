import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Home } from "../screens/Home";
import { THEME } from "../theme";
import { UploadCalories } from "../screens/UploadCalories";
import { Login, Register } from "../screens/Auth";

interface HomeProps {}
interface UploadCaloriesProps {}
interface LoginProps {}
interface RegisterProps {}

export type RootStackParamList = {
  Home: HomeProps;
  UploadCalories: UploadCaloriesProps;
  Login: LoginProps;
  Register: RegisterProps;
};

const { Navigator, Screen } = createBottomTabNavigator<RootStackParamList>();

export function AppRoutes() {
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          borderTopColor: THEME.COLORS.SHAPE,
          borderTopWidth: 3,
        },
      }}
      initialRouteName={/* user !== null ? "home" : */ "Login"}
      backBehavior="none"
    >
      <Screen
        options={{
          tabBarButton: () => null,
          tabBarActiveTintColor: THEME.COLORS.WHITE_TEXT,
          tabBarInactiveTintColor: THEME.COLORS.ALERT,
          tabBarStyle: {
            display: "none",
          },
        }}
        name="Login"
        component={Login}
      />
      <Screen
        options={{
          tabBarButton: () => null,
          tabBarActiveTintColor: THEME.COLORS.WHITE_TEXT,
          tabBarInactiveTintColor: THEME.COLORS.ALERT,
          tabBarStyle: {
            display: "none",
          },
        }}
        name="Register"
        component={Register}
      />
      <Screen
        options={{
          tabBarLabel: "Home",
          tabBarActiveTintColor: THEME.COLORS.WHITE_TEXT,
          tabBarInactiveTintColor: THEME.COLORS.ALERT,
          tabBarLabelStyle: {
            color: THEME.COLORS.TEXT,
            fontSize: THEME.FONT_SIZE.SM,
          },
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="home"
              color={THEME.COLORS.SHAPE}
              size={size}
            />
          ),
        }}
        name="Home"
        component={Home}
      />
      <Screen
        options={{
          tabBarLabel: "Eat",
          tabBarActiveTintColor: THEME.COLORS.WHITE_TEXT,
          tabBarInactiveTintColor: THEME.COLORS.ALERT,
          tabBarLabelStyle: {
            color: THEME.COLORS.TEXT,
            fontSize: THEME.FONT_SIZE.SM,
          },
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="food"
              color={THEME.COLORS.SHAPE}
              size={size}
            />
          ),
        }}
        name="UploadCalories"
        component={UploadCalories}
      />
    </Navigator>
  );
}
