import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import History from '../screens/History';
import DataViz from '../screens/DataVizPlaceholder';
import Resources from '../screens/Resources';
import UserProfile from '../screens/UserProfile';

const Tab = createBottomTabNavigator();

const Tabs = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen}></Tab.Screen>
      <Tab.Screen name="DataViz" component={DataViz}></Tab.Screen>
      <Tab.Screen name="History" component={History}></Tab.Screen>
      <Tab.Screen name="Resources" component={Resources}></Tab.Screen>
    </Tab.Navigator>
  );
};
