import { signOut } from '@firebase/auth';
import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth } from '../firebase';
import LottieView from 'lottie-react-native';

const HomeScreen = () => {
  const navigation = useNavigation();
  const leaveHomePage = () => {
    navigation.replace('Activities');
  };

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../assets/21254-clamshell-opening-with-pearl/data.json')}
        autoPlay
        loop
        style={styles.lottiePearl}
      />
      <TouchableOpacity style={styles.button} onPress={leaveHomePage}>
        <Text style={styles.buttonText}>Enter Journal</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#0782F9',
    width: '60%',
    padding: 15,
    borderRadius: 10,
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  lottiePearl: {
    width: 200,
    height: 200,
  },
});
