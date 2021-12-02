import React from "react";
import { StyleSheet, View } from "react-native";

import MoodChart from "./MoodChart";
import ActivityTracker from "./ActivityTracker";

const MyData = () => {
  return (
    <View style={[styles.container, { flexDirection: "column" }]}>
      <ActivityTracker />
      <MoodChart />
    </View>
  );
};

export default MyData;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
  },
});
