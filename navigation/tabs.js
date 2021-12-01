import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import History from '../screens/History';
import DataViz from '../screens/DataVizPlaceholder';
import Resources from '../screens/Resources';
import UserProfile from '../screens/UserProfile';
import { MainStackNavigator } from './stacks';
import MoodChart from '../screens/MoodChart';
import { Image } from 'react-native';
import ActivityTracker from '../screens/ActivityTracker';

//we need to create style settings / rely on state here to put icons in our Tabs
const Tab = createBottomTabNavigator();

//our tabs can take components that include stacked screens that feed into each other
const Tabs = () => {
  return (
    <Tab.Navigator
      tabBarOptions={{
        showIcon: true,
        labelStyle: { fontSize: 14 },
        activeTintColor: 'blue',
      }}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={MainStackNavigator}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused, color, size }) => (
            <Image
              source={
                focused
                  ? require('../assets/icons/home.png')
                  : require('../assets/icons/home.png')
              }
              style={{
                width: size,
                height: size,
                borderRadius: size,
              }}
            />
          ),
        }}
      ></Tab.Screen>
      <Tab.Screen
        name="DataViz"
        component={MoodChart}
        options={{
          tabBarLabel: 'My Data',
          tabBarIcon: ({ focused, color, size }) => (
            <Image
              source={
                focused
                  ? require('../assets/icons/lineChartSmall.png')
                  : require('../assets/icons/lineChartSmall.png')
              }
              style={{
                width: size,
                height: size,
                borderRadius: size,
              }}
            />
          ),
        }}
      ></Tab.Screen>
      <Tab.Screen
        name="History"
        component={History}
        options={{
          tabBarLabel: 'My Journals',
          tabBarIcon: ({ focused, color, size }) => (
            <Image
              source={
                focused
                  ? require('../assets/icons/calendar.png')
                  : require('../assets/icons/calendar.png')
              }
              style={{
                width: size,
                height: size,
                borderRadius: size,
              }}
            />
          ),
        }}
      ></Tab.Screen>
      <Tab.Screen
        name="Resources"
        component={Resources}
        options={{
          tabBarLabel: 'Resources',
          tabBarIcon: ({ focused, color, size }) => (
            <Image
              source={
                focused
                  ? require('../assets/icons/resources.png')
                  : require('../assets/icons/resources.png')
              }
              style={{
                width: size,
                height: size,
                borderRadius: size,
              }}
            />
          ),
        }}
      ></Tab.Screen>
    </Tab.Navigator>
  );
};

export default Tabs;
