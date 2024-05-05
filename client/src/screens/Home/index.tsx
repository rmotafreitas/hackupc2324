import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ImageSourcePropType,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  api,
  foodInterfaceType,
  userInterfaceType,
  weightInterfaceType,
} from "../../api";
import { Background } from "../../components/Background";
import { WeightModal } from "../../components/WeightModal";
import { UserContext } from "../../contexts/user.context";
import { RootStackParamList } from "../../routes/app.routes";
import { THEME } from "../../theme";
import EditImg from "./../../assets/edit.png";
import UnfoldWhiteImage from "./../../assets/Group 7 (1).png";
import UnfoldImage from "./../../assets/Group 7.png";
import MenuImage from "./../../assets/logo (1).png";
import MoonImage from "./../../assets/Moon (1).png";
import PlusImage from "./../../assets/Plus.png";
import ConfigImage from "./../../assets/Settings (1).png";
import SunImage from "./../../assets/Sun.png";
import SunriseImage from "./../../assets/Sunrise.png";
import { styles } from "./styles";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

function MyCheckbox() {
  const [checked, setChecked] = useState(false);
  return (
    <Pressable
      style={[styles.checkboxBase, checked && styles.checkboxChecked]}
      onPress={() => setChecked(!checked)}
    >
      {checked && (
        <Ionicons name="checkmark" size={20} color={THEME.COLORS.TEXT} />
      )}
    </Pressable>
  );
}

export const getUserSavedDataOrNull = async () => {
  try {
    const userFromStorage = await AsyncStorage.getItem("@user");
    if (!userFromStorage) {
      return null;
    }
    const access_token = await AsyncStorage.getItem("@token");
    const userFromStorageTyped = JSON.parse(
      userFromStorage
    ) as userInterfaceType;
    const userFromDatabase = await api.post(
      "/me",
      {
        email: userFromStorageTyped.email,
      },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    // save the updated user data to storage
    await AsyncStorage.setItem("@user", JSON.stringify(userFromDatabase.data));
    return userFromDatabase.data;
  } catch (e) {
    return null;
  }
};

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export function isThisStringSameDayAs(date: string, anotherDate: string) {
  const dateObj = date.split("T")[0];
  const today = anotherDate.split("T")[0];
  return dateObj === today;
}

export function foodFrom(foods: foodInterfaceType[], date: string) {
  return foods.filter((food) => isThisStringSameDayAs(food.time, date));
}

export function Home({ route, navigation }: Props) {
  useFocusEffect(
    useCallback(() => {
      getUserSavedDataOrNull().then((user) => {
        if (user) {
          userContext?.setUser(user);
        }
      });
    }, [route])
  );

  const [date, setDate] = useState(new Date());

  const onChange = (event: any, selectedDate: any) => {
    const currentDate = selectedDate;
    setDate(currentDate);
  };

  const showMode = (currentMode: any) => {
    DateTimePickerAndroid.open({
      value: date,
      onChange,
      mode: currentMode,
      is24Hour: true,
    });
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const navigator = useNavigation();

  const userContext = useContext(UserContext);

  useEffect(() => {
    getUserSavedDataOrNull();
  }, []);

  const [weightModalVisible, setWeightModalVisible] = useState<boolean>(false);

  if (
    userContext === null ||
    userContext === undefined ||
    userContext.user === null
  ) {
    navigator.navigate("Login");
  }

  const calcNutrionValue = (foods: foodInterfaceType[]) => {
    return foods.reduce((acc, food) => acc + food.nutrionValue, 0);
  };

  const calcProteinValue = (foods: foodInterfaceType[]) => {
    return foods.reduce((acc, food) => acc + food.proteinValue, 0);
  };

  const calcCarbonValue = (foods: foodInterfaceType[]) => {
    return foods.reduce((acc, food) => acc + food.carbonValue, 0);
  };

  const calcSaltValue = (foods: foodInterfaceType[]) => {
    return foods.reduce((acc, food) => acc + food.saltValue, 0);
  };

  const calcStatusForADay = (foods: foodInterfaceType[], date: string) => {
    return {
      nutrionValue: calcNutrionValue(foodFrom(foods, date)),
      proteinValue: calcProteinValue(foodFrom(foods, date)),
      carbonValue: calcCarbonValue(foodFrom(foods, date)),
      saltValue: calcSaltValue(foodFrom(foods, date)),
    };
  };

  const status = calcStatusForADay(
    userContext?.user?.stats.foods || [],
    new Date(date).toISOString()
  );

  const [weight, setWeight] = useState<number>(0);

  useEffect(() => {
    const weightAux = userContext?.user?.stats.Weight.find((weight) => {
      console.log(weight.time, new Date(date).toISOString());
      return isThisStringSameDayAs(weight.time, new Date(date).toISOString());
    })?.weight;
    console.log(weightAux);
    if (weightAux) {
      setWeight(weightAux);
    } else {
      setWeight(0);
    }
  }, [date]);

  return (
    <Background>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.containerApp}>
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              marginVertical: 20,
              paddingHorizontal: 10,
              height: 40,
            }}
          >
            <TouchableOpacity
              style={{
                borderWidth: 2,
                borderColor: "#E89D57",
                height: 40,
                width: 40,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 5,
              }}
              onPress={() => {
                // @ts-ignore
                navigation.navigate("Chat");
              }}
            >
              <Image
                style={{
                  height: 30,
                  width: 30,
                  objectFit: "contain",
                }}
                source={MenuImage}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                showDatepicker();
              }}
              style={styles.todayDiv}
            >
              <Text style={styles.todayText}>
                {isThisStringSameDayAs(
                  new Date().toISOString(),
                  date.toISOString()
                )
                  ? "Today"
                  : date.toISOString().split("T")[0]}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                borderWidth: 2,
                borderColor: "#E89D57",
                height: 40,
                width: 40,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 5,
              }}
              onPress={() => {
                // @ts-ignore
                navigation.navigate("Update");
              }}
            >
              <Image
                style={{
                  height: 30,
                  width: 30,
                  objectFit: "contain",
                }}
                source={ConfigImage}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: "row",
              gap: 10,
              paddingHorizontal: 10,
              marginBottom: 25,
            }}
          >
            <Stat
              label="Calories"
              value={`${status.nutrionValue} / ${userContext?.user?.nutrionValue}`}
            />
            <Stat
              label="Protein"
              value={`${status.proteinValue} / ${userContext?.user?.proteinValue}`}
            />
            <Stat label="Carbs" value={`${status.carbonValue}`} />
            <Stat label="Sugar" value={`${status.saltValue}`} />
          </View>
          <View style={styles.MealBoxAll}>
            <Meals
              label="Breakfast"
              value1={foodFrom(
                userContext?.user?.stats.foods || [],
                new Date(date).toISOString()
              ).reduce(
                (acc, food) =>
                  food.type === "BREAKFAST" ? acc + food.nutrionValue : acc,
                0
              )}
              value2={foodFrom(
                userContext?.user?.stats.foods || [],
                new Date(date).toISOString()
              ).reduce(
                (acc, food) =>
                  food.type === "BREAKFAST" ? acc + food.proteinValue : acc,
                0
              )}
              value3={foodFrom(
                userContext?.user?.stats.foods || [],
                new Date(date).toISOString()
              ).reduce(
                (acc, food) =>
                  food.type === "BREAKFAST" ? acc + food.carbonValue : acc,
                0
              )}
              value4={foodFrom(
                userContext?.user?.stats.foods || [],
                new Date(date).toISOString()
              ).reduce(
                (acc, food) =>
                  food.type === "BREAKFAST" ? acc + food.saltValue : acc,
                0
              )}
              img={SunriseImage}
              foods={foodFrom(
                userContext?.user?.stats.foods || [],
                new Date(date).toISOString()
              ).filter((food) => food.type === "BREAKFAST")}
            />
            <Meals
              label="Lunch"
              foods={foodFrom(
                userContext?.user?.stats.foods || [],
                new Date(date).toISOString()
              ).filter((food) => food.type === "LUNCH")}
              value1={foodFrom(
                userContext?.user?.stats.foods || [],
                new Date(date).toISOString()
              ).reduce(
                (acc, food) =>
                  food.type === "LUNCH" ? acc + food.nutrionValue : acc,
                0
              )}
              value2={foodFrom(
                userContext?.user?.stats.foods || [],
                new Date(date).toISOString()
              ).reduce(
                (acc, food) =>
                  food.type === "LUNCH" ? acc + food.proteinValue : acc,
                0
              )}
              value3={foodFrom(
                userContext?.user?.stats.foods || [],
                new Date(date).toISOString()
              ).reduce(
                (acc, food) =>
                  food.type === "LUNCH" ? acc + food.carbonValue : acc,
                0
              )}
              value4={foodFrom(
                userContext?.user?.stats.foods || [],
                new Date(date).toISOString()
              ).reduce(
                (acc, food) =>
                  food.type === "LUNCH" ? acc + food.saltValue : acc,
                0
              )}
              img={SunImage}
            />
            <Meals
              label="Dinner"
              foods={foodFrom(
                userContext?.user?.stats.foods || [],
                new Date(date).toISOString()
              ).filter((food) => food.type === "DINNER")}
              value1={foodFrom(
                userContext?.user?.stats.foods || [],
                new Date(date).toISOString()
              ).reduce(
                (acc, food) =>
                  food.type === "DINNER" ? acc + food.nutrionValue : acc,
                0
              )}
              value2={foodFrom(
                userContext?.user?.stats.foods || [],
                new Date(date).toISOString()
              ).reduce(
                (acc, food) =>
                  food.type === "DINNER" ? acc + food.proteinValue : acc,
                0
              )}
              value3={foodFrom(
                userContext?.user?.stats.foods || [],
                new Date(date).toISOString()
              ).reduce(
                (acc, food) =>
                  food.type === "DINNER" ? acc + food.carbonValue : acc,
                0
              )}
              value4={foodFrom(
                userContext?.user?.stats.foods || [],
                new Date(date).toISOString()
              ).reduce(
                (acc, food) =>
                  food.type === "DINNER" ? acc + food.saltValue : acc,
                0
              )}
              img={SunriseImage}
            />
            <Meals
              label="Others"
              foods={foodFrom(
                userContext?.user?.stats.foods || [],
                new Date(date).toISOString()
              ).filter((food) => food.type === "OTHER")}
              value1={foodFrom(
                userContext?.user?.stats.foods || [],
                new Date(date).toISOString()
              ).reduce(
                (acc, food) =>
                  food.type === "OTHER" ? acc + food.nutrionValue : acc,
                0
              )}
              value2={foodFrom(
                userContext?.user?.stats.foods || [],
                new Date(date).toISOString()
              ).reduce(
                (acc, food) =>
                  food.type === "OTHER" ? acc + food.proteinValue : acc,
                0
              )}
              value3={foodFrom(
                userContext?.user?.stats.foods || [],
                new Date(date).toISOString()
              ).reduce(
                (acc, food) =>
                  food.type === "OTHER" ? acc + food.carbonValue : acc,
                0
              )}
              value4={foodFrom(
                userContext?.user?.stats.foods || [],
                new Date(date).toISOString()
              ).reduce(
                (acc, food) =>
                  food.type === "OTHER" ? acc + food.saltValue : acc,
                0
              )}
              img={MoonImage}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "space-between",
              gap: 10,
              paddingHorizontal: 10,
              marginBottom: 20,
            }}
          >
            <Extra label="Steps" value="14000 / 0" />
            <Extra
              doAction={async () => {
                setWeightModalVisible(true);
              }}
              unfoldAction={() => {
                // @ts-ignore
                navigation.navigate("Table");
              }}
              label="Weight"
              value={weight ? `${weight} kg` : "0 kg"}
              img={weight != 0 ? EditImg : PlusImage}
            />
            <Extra label="Training" img={PlusImage} />
            <Extra label="Period" check />
          </View>
          {/* <View
            style={{
              width: Dimensions.get("screen").width * 0.95,
              borderColor: "#E89D57",
              borderWidth: 2,
              borderRadius: 5,
            }}
          >
            <View style={styles.ProgressBox}>
              <Text style={styles.ProgressText}>Progress</Text>
              <Text style={styles.ProgressDate}>28.04-05.05</Text>
              <Image
                source={UnfoldWhiteImage}
                style={styles.UnfoldWhiteImage}
              />
            </View>
          </View> */}
          <WeightModal
            handleClose={() => {
              setWeightModalVisible(false);
            }}
            visible={weightModalVisible}
            weight={weight || 0}
            date={new Date(date).toISOString()}
          />
        </ScrollView>
      </SafeAreaView>
    </Background>
  );
}

interface StatProps {
  label: string;
  value: string;
}

function Stat({ label, value }: StatProps) {
  return (
    <View
      style={{
        borderColor: "#E89D57",
        borderWidth: 2,
        borderRadius: 5,
        flex: 1,
      }}
    >
      <View style={styles.CaloriesUp}>
        <Text style={styles.boxText}>{label}</Text>
      </View>
      <View style={styles.boxTextDiv}>
        <Text style={styles.boxText}>{value}</Text>
      </View>
    </View>
  );
}

interface MealsBox {
  label: string;
  value1: number;
  value2: number;
  value3: number;
  value4: number;
  img: ImageSourcePropType;
  foods: foodInterfaceType[];
}

function Meals({
  foods,
  label,
  value1,
  value2,
  value3,
  value4,
  img,
}: MealsBox) {
  const navigation = useNavigation();
  const [unfold, setUnfold] = useState<boolean>(false);
  const userContext = useContext(UserContext);

  return (
    <View
      style={{
        width: Dimensions.get("screen").width * 0.95,
        borderColor: "#E89D57",
        borderWidth: 2,
        borderRadius: 5,
      }}
    >
      <View style={styles.Meals}>
        <View style={styles.MealsRow}>
          <Image source={img} style={styles.SunriseImage} />
          <Text style={styles.boxText}>{label}</Text>
        </View>
        <View style={styles.MealsRow}>
          {foods.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setUnfold(!unfold);
              }}
              style={styles.PlusImage}
            >
              <Image
                source={UnfoldWhiteImage}
                style={{
                  objectFit: "contain",
                }}
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => {
              let foodType: "BREAKFAST" | "LUNCH" | "DINNER" | "OTHER" =
                "BREAKFAST";
              switch (label) {
                case "Breakfast":
                  foodType = "BREAKFAST";
                  break;
                case "Lunch":
                  foodType = "LUNCH";
                  break;
                case "Dinner":
                  foodType = "DINNER";
                  break;
                case "Others":
                  foodType = "OTHER";
                  break;
                default:
                  foodType = "BREAKFAST";
              }
              navigation.navigate("UploadCalories", {
                foodType,
              });
            }}
            style={styles.PlusImage}
          >
            <Image
              source={PlusImage}
              style={{
                objectFit: "contain",
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.MealBoxIndex}>
        <Text style={styles.MealBoxText}>{value1}</Text>
        <Text style={styles.MealBoxText}>{value2}</Text>
        <Text style={styles.MealBoxText}>{value3}</Text>
        <Text style={styles.MealBoxText}>{value4}</Text>
      </View>
      {unfold && (
        <View>
          {foods.map((food: foodInterfaceType, index: number) => (
            <>
              <View
                style={{
                  borderTopColor: "#E89D57",
                  borderTopWidth: 2,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                }}
              >
                <Text>{food.name}</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  paddingVertical: 2,
                  paddingHorizontal: 10,
                }}
              >
                <Text>{food.nutrionValue}</Text>
                <Text>{food.proteinValue}</Text>
                <Text>{food.carbonValue}</Text>
                <Text>{food.sugarValue}</Text>
              </View>
            </>
          ))}
        </View>
      )}
    </View>
  );
}

interface ExtraBox {
  label: string;
  value?: string;
  img?: ImageSourcePropType;
  check?: boolean;
  doAction?: () => Promise<void>;
  unfoldAction?: () => void;
}

function Extra({ label, value, img, check, doAction, unfoldAction }: ExtraBox) {
  const [checkPeriod, setCheckPeriod] = useState<boolean>(false);

  const handleClickCheckPeriod = () => {
    setCheckPeriod(!checkPeriod);
  };

  return (
    <View
      style={{
        borderColor: "#E89D57",
        borderWidth: 2,
        borderRadius: 5,
      }}
    >
      <View style={styles.StepsUp}>
        <Text style={styles.StepsUpText}>{label}</Text>
        <TouchableOpacity
          onPress={() => {
            if (unfoldAction) {
              unfoldAction();
            }
          }}
        >
          <Image source={UnfoldImage} style={styles.UnfoldImage} />
        </TouchableOpacity>
      </View>
      <View style={styles.StepsDown}>
        {value && <Text style={styles.boxText}>{value}</Text>}
        {img && (
          <TouchableOpacity
            style={styles.PlusImage2}
            onPress={() => {
              if (doAction) {
                doAction();
              }
            }}
          >
            <Image
              source={img}
              style={{
                objectFit: "contain",
                height: "100%",
                width: "100%",
              }}
            />
          </TouchableOpacity>
        )}
        {check && <MyCheckbox />}
      </View>
    </View>
  );
}
