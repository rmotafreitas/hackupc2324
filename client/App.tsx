import { StatusBar } from "react-native";
import { Background } from "./src/components/Background";

import { useEffect, useMemo, useState } from "react";
import { ErrorContext } from "./src/contexts/error.context";
import { SuccessContext } from "./src/contexts/success.context";
import { DiscordUser, UserContext } from "./src/contexts/user.context";
import { Routes } from "./src/routes";
import { Loading } from "./src/screens/Loading";
import { THEME } from "./src/theme";
import { PopUpStatus } from "./src/components/PopUpStatus";
import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_900Black,
} from "@expo-google-fonts/inter";

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_900Black,
  });

  const [isLoading, setIsLoading] = useState(true);

  const [user, setUser] = useState<DiscordUser | null>(null);

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const userProvider = useMemo(() => ({ user, setUser }), [user, setUser]);

  const errorMessageProvider = useMemo(
    () => ({ errorMessage, setErrorMessage }),
    [errorMessage, setErrorMessage]
  );

  const successMessageProvider = useMemo(
    () => ({ successMessage, setSuccessMessage }),
    [successMessage, setSuccessMessage]
  );

  useEffect(() => {
    (async () => {
      console.log("App mounted");
      setIsLoading(false);
    })();
    return () => {
      console.log("App unmounted");
      try {
      } catch (err) {
        console.log(err);
      }
    };
  }, []);

  return (
    <>
      <StatusBar
        backgroundColor={THEME.COLORS.PRIMARY}
        barStyle="light-content"
        translucent
      />
      {fontsLoaded && !isLoading ? (
        <Background>
          <UserContext.Provider value={userProvider}>
            <ErrorContext.Provider value={errorMessageProvider}>
              <SuccessContext.Provider value={successMessageProvider}>
                <Routes />
                <PopUpStatus />
              </SuccessContext.Provider>
            </ErrorContext.Provider>
          </UserContext.Provider>
        </Background>
      ) : (
        <Loading />
      )}
    </>
  );
}
