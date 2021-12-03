import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/core';
const ImagePreview = ({ photoURI, retakePhoto, clearImage }) => {
  const navigation = useNavigation();
  const handleUsePhoto = () => {
    navigation.navigate('TextEntry', {
      photoURI,
      clearImage,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={{ uri: photoURI }} style={styles.displayImage}>
        <View style={styles.btnContainer}>
          <View style={styles.btnRow}>
            <TouchableOpacity onPress={retakePhoto}>
              <Image source={require('../assets/icons/go-back.png')} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleUsePhoto}>
              <Image source={require('../assets/icons/go-ahead.png')} />
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
    flex: 0.9,
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
});
