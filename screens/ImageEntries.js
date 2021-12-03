import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Button,
  Platform,
  SafeAreaView,
  Image,
} from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import ImagePreview from './ImagePreview';

const ImageEntries = () => {
  let cameraRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [hasCameraRollPermission, setHasCameraRollPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [preview, setPreview] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

  useEffect(() => {
    const getPermission = async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasPermission(cameraStatus.status === 'granted');
      const cameraRollStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasCameraRollPermission(cameraRollStatus.status === 'granted');
    };
    getPermission();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  const takePicture = async () => {
    if (!hasPermission) return;
    //returns an object containing information about the photo, including uri
    const photo = await cameraRef.current.takePictureAsync({
      quality: 0.5,
    });
    setPreview(true);
    setCapturedImage(photo);
  };

  const clearImage = () => {
    setCapturedImage(null);
    setPreview(false);
  };
  const retakePhoto = () => {
    setCapturedImage(null);
    setPreview(false);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 0.3,
    });
    if (!result.cancelled) {
      setCapturedImage(result);
      setPreview(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {preview && capturedImage && (
        <ImagePreview
          photoURI={capturedImage.uri}
          retakePhoto={retakePhoto}
          clearImage={clearImage}
        />
      )}
      {hasPermission && !preview && !capturedImage && (
        <Camera style={styles.camera} type={type} ref={cameraRef}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => {
                setType(
                  type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back
                );
              }}
            >
              <Image source={require('../assets/icons/camera-flip.png')} />
            </TouchableOpacity>
            {hasCameraRollPermission && !preview && !capturedImage && (
              <TouchableOpacity onPress={pickImage}>
                <Image source={require('../assets/icons/photoAlbum.png')} />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.circleButtonContainer}>
            <View style={styles.circleButtonPlacement}>
              <TouchableOpacity
                onPress={takePicture}
                style={styles.circleButton}
              />
            </View>
          </View>
        </Camera>
      )}
    </SafeAreaView>
  );
};

export default ImageEntries;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 0.9,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
    justifyContent: 'space-between',
  },

  text: {
    fontSize: 18,
    color: 'white',
  },
  circleButtonContainer: {
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    flex: 1,
    width: '100%',
    padding: 20,
    justifyContent: 'space-between',
  },
  circleButton: {
    width: 70,
    height: 70,
    bottom: 0,
    borderRadius: 50,
    backgroundColor: '#fff',
  },
  circleButtonPlacement: {
    alignSelf: 'center',
    flex: 1,
    alignItems: 'center',
  },
});
