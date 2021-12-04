import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

const LoadingIcon = () => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color="#BDD8F1" style={styles.container} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center"
  },
});

export default LoadingIcon;