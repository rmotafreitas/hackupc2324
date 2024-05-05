import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useContext } from "react";
import { UserContext } from "../contexts/user.context";
import { Login, Register } from "../screens/Auth";
import { Home } from "../screens/Home";
import { UploadCalories } from "../screens/UploadCalories";
import { Table } from "../screens/Table";
import { useNavigation } from "@react-navigation/native";
import { Chat } from "../screens/Chat";

interface HomeProps {}
interface UploadCaloriesProps {
  foodType: "BREAKFAST" | "LUNCH" | "DINNER" | "OTHER";
}
interface LoginProps {}
interface RegisterProps {}
interface TableProps {}
interface ChatProps {}

export type RootStackParamList = {
  Home: HomeProps;
  UploadCalories: UploadCaloriesProps;
  Login: LoginProps;
  Register: RegisterProps;
  Table: TableProps;
  Chat: ChatProps;
};

const { Navigator, Screen } = createNativeStackNavigator<RootStackParamList>();

export function AppRoutes() {
  const userContext = useContext(UserContext);

  return (
    <Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={userContext?.user ? "Home" : "Login"}
    >
      <Screen name="Login" component={Login} />
      <Screen name="Register" component={Register} />
      <Screen name="Home" component={Home} />
      <Screen name="UploadCalories" component={UploadCalories} />
      <Screen name="Table" component={Table} />
      <Screen name="Chat" component={Chat} />
    </Navigator>
  );
}
