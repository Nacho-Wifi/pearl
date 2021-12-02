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
const ImagePreview = ({ photoURI, retakePhoto, savePhoto }) => {
  const navigation = useNavigation();
  const handleUsePhoto = () => {
    navigation.navigate('TextEntry', {
      photoURI,
    });
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: 'transparent',
        flex: 0.5,
      }}
    >
      <ImageBackground
        source={{ uri: photoURI }}
        style={{
          flex: 1,
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'column',
            padding: 15,
            justifyContent: 'flex-end',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}
          >
            <TouchableOpacity
              onPress={retakePhoto}
              style={{
                width: 130,
                height: 40,

                alignItems: 'center',
                borderRadius: 4,
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  fontSize: 20,
                }}
              >
                Try Again
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleUsePhoto}
              style={{
                width: 130,
                height: 40,

                alignItems: 'center',
                borderRadius: 4,
              }}
            >
              <Text
                style={{
                  color: '#fff',
                  fontSize: 20,
                }}
              >
                Use Photo!
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default ImagePreview;

const styles = StyleSheet.create({});
