import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Button,
  Platform,
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
    const photo = await cameraRef.current.takePictureAsync();
    setPreview(true);
    setCapturedImage(photo);
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setPreview(false);
  };

  const pickImage = async () => {
    setPreview(true);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    setCapturedImage(result);
  };

  return (
    <View style={styles.container}>
      {preview && capturedImage && (
        <ImagePreview photoURI={capturedImage.uri} retakePhoto={retakePhoto} />
      )}
      {hasPermission && !preview && !capturedImage && (
        <Camera style={styles.camera} type={type} ref={cameraRef}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setType(
                  type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back
                );
              }}
            >
              <Text style={styles.text}> Flip </Text>
            </TouchableOpacity>
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
      {hasCameraRollPermission && !preview && !capturedImage && (
        <Button
          title="Or pick an image from camera roll!"
          onPress={pickImage}
        />
      )}
    </View>
  );
};

export default ImageEntries;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 0.5,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  button: {
    marginTop: 25,
    height: 25,
    width: 35,
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
