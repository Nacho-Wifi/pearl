import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import JournalEntry from '../screens/JournalEntry';
import Activities from '../screens/Activities';
import ImageEntries from '../screens/ImageEntries';
import TextEntry from '../screens/TextEntry';
import SignUp from '../screens/SignUp';
// import MoodChart from '../screens/MoodChart';
// import ActivityTracker from '../screens/ActivityTracker';

const Stack = createNativeStackNavigator();

//this is where we store all the pages that feed into each other - aka where navigation stacks components on top of each other. we're turning them into one component so we can nest them inside our tabs, which appear across pages

const MainStackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="ImageEntries"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ImageEntries" component={ImageEntries} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="Activities" component={Activities} />
      <Stack.Screen name="JournalEntry" component={JournalEntry} />
      <Stack.Screen name="TextEntry" component={TextEntry} />
      {/* <Stack.Screen name="MoodChart" component={MoodChart} />
      <Stack.Screen name="ActivityTracker" component={ActivityTracker} /> */}
    </Stack.Navigator>
  );
};

export { MainStackNavigator };
