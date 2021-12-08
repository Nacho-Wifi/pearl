import React from 'react';
import { StyleSheet, View } from 'react-native';

import MoodChart from './MoodChart';
import ActivityTracker from './ActivityTracker';
import MoodActivity2 from './MoodActivity2'
import { color } from 'react-native-reanimated';
import MyData2 from './MyData2'

const MyData = () => {



  return (
    <View style={[styles.container, { flexDirection: 'column' }]}>
      <ActivityTracker />
      <MyData2 />
    </View>
  );
};

export default MyData;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    // backgroundColor: '#8fc5d3'
    backgroundColor: '#b0d7e1'
  },
});
