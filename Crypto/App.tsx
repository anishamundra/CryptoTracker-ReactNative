import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { RootStackParamList } from "./src/types/navigation";
import HomeScreen from "./src/screens/HomeScreen";
import CryptoDetailScreen from "./src/screens/CryptoDetailScreen";
import FavouritesScreen from "./src/screens/FavouritesScreen";

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Crypto Exchange" }}
        />
        <Stack.Screen
          name="CryptoDetail"
          component={CryptoDetailScreen}
          options={{ title: "Crypto Details" }}
        />
        <Stack.Screen
          name="Favourites"
          component={FavouritesScreen}
          options={{ title: "Favourite Coins" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;