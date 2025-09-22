import React, { useEffect } from 'react';
import { BackHandler, Alert, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import screens
import GetStartedScreen from './screens/GetStartedScreen';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import RegisterScreen from './screens/RegisterScreen'; 
import EducationalScreen from './screens/EducationalScreen'; 

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    // ----- Web -----
    if (Platform.OS === "web") {
      const handleBeforeUnload = (e) => {
        e.preventDefault();
        e.returnValue = "Are you sure you want to leave this page?";
      };
      window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }

    // ----- Android / Mobile -----
    if (Platform.OS === "android") {
      const backAction = () => {
        Alert.alert(
          "Hold on!",
          "Are you sure you want to exit the app?",
          [
            { text: "Cancel", onPress: () => null, style: "cancel" },
            { text: "YES", onPress: () => BackHandler.exitApp() },
          ]
        );
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      return () => backHandler.remove();
    }
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="GetStarted" component={GetStartedScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} /> 
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="EducationalScreen" component={EducationalScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
