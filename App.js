import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

//navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//screens
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import JournalEntry from './screens/JournalEntry';
import Activities from './screens/Activities';
import SignUp from './screens/SignUp';
import MoodChart from  './screens/MoodChart';
import ActivityTracker from './screens/ActivityTracker';
import { registerRootComponent } from 'expo';

//auth
import { auth } from './firebase';

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

  if (!loaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text>Loading...</Text>
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
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Activities" component={Activities} />
          <Stack.Screen name="JournalEntry" component={JournalEntry} />
          <Stack.Screen name="MoodChart" component={MoodChart} />
          <Stack.Screen name="ActivityTracker" component={ActivityTracker} />
        </Stack.Navigator>
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
