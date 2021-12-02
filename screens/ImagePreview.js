import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/core';
const ImagePreview = ({ photoURI, retakePhoto }) => {
  const navigation = useNavigation();
  const handleUsePhoto = () => {
    navigation.navigate('TextEntry', {
      photoURI,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={{ uri: photoURI }} style={styles.displayImage}>
        <View style={styles.btnContainer}>
          <View style={styles.btnRow}>
            <TouchableOpacity onPress={retakePhoto} style={styles.btn}>
              <Text style={styles.btnText}>Try Again</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleUsePhoto} style={styles.btn}>
              <Text style={styles.btnText}>Use Photo!</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default ImagePreview;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flex: 0.5,
  },
  displayImage: {
    flex: 1,
  },
  btnContainer: {
    flex: 1,
    flexDirection: 'column',
    padding: 15,
    justifyContent: 'flex-end',
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  btn: {
    width: 130,
    height: 40,
    alignItems: 'center',
    borderRadius: 4,
  },
  btnText: {
    color: '#fff',
    fontSize: 20,
  },
});
