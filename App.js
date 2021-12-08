import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

//navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//screens (many are held in a component rendered by tabs - please see tabs.js under navigation)
import LoginScreen from './screens/LoginScreen';
import SignUp from './screens/SignUp';
import { registerRootComponent } from 'expo';
import Tabs from './navigation/tabs';
import LoadingIcon from './screens/components/LoadingIcon';

//auth
import { auth } from './firebase';

//customize text
import { setCustomText } from 'react-native-global-props';

const Stack = createNativeStackNavigator();

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setLoggedIn(true);
        setLoaded(true);
      } else {
        setLoggedIn(false);
        setLoaded(true);
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    setCustomText({
      style: {
        fontFamily: 'Avenir',
      },
    });
  }, []);

  if (!loaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <LoadingIcon />
      </View>
    );
  }

  if (!loggedIn) {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            options={{ headerShown: false }}
            name="Login"
            component={LoginScreen}
          />
          <Stack.Screen
            options={{ headerShown: false }}
            name="SignUp"
            component={SignUp}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      <Tabs />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
