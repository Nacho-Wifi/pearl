import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import ImagePreview from './ImagePreview';
import { ref, getDownloadURL, uploadBytes, getStorage } from 'firebase/storage';
import { auth } from '../firebase';
import uuid from 'react-native-uuid';

const ImageEntries = () => {
  let cameraRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [preview, setPreview] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
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
    console.log('i am the photo', photo);
  };

  const savePhoto = async () => {
    const imageUri = capturedImage.uri;
    //fetch image from the uri
    const response = await fetch(imageUri);
    //create a blob of the image which we will then pass on to firestore and will then upload the image
    const blob = await response.blob();
    // var ref = firebase.storage().ref().child('my-image');

    const path = `journal/${auth.currentUser.uid}/${uuid.v4()}`;
    const storage = getStorage();
    const storageRef = ref(storage, path);
    const uploadTask = await uploadBytes(storageRef, blob);
    console.log('i am uploadTask', uploadTask);
    // const taskProgress = (snapshot) => {
    //   console.log(`transferred: ${snapshot.bytesTransferred}`);
    // };

    // const taskError = (error) => {
    //   console.log('Error found', error);
    // };

    // const taskCompleted = () => {
    //   getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
    //     console.log('File available at', downloadURL);
    //   });
    // };

    // uploadTask.on('state_changed', taskProgress, taskError, taskCompleted);
    // uploadTask.on(
    //   'state_changed',
    //   taskProgress,
    //   taskError,
    //   taskCompleted
    //   // (snapshot) => {
    //   //   // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    //   //   const progress =
    //   //     (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    //   //   console.log('Upload is ' + progress + '% done');
    //   // },
    //   // (error) => {
    //   //   console.log(error);
    //   // },
    //   // () => {
    //   //   // Upload completed successfully, now we can get the download URL
    //   //   getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
    //   //     console.log('File available at', downloadURL);
    //   //   });
    //   // }
    // );
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setPreview(false);
  };
  return (
    <View style={styles.container}>
      {preview && capturedImage ? (
        <ImagePreview
          photo={capturedImage}
          savePhoto={savePhoto}
          retakePhoto={retakePhoto}
        />
      ) : (
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
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              flexDirection: 'row',
              flex: 1,
              width: '100%',
              padding: 20,
              justifyContent: 'space-between',
            }}
          >
            <View
              style={{
                alignSelf: 'center',
                flex: 1,
                alignItems: 'center',
              }}
            >
              <TouchableOpacity
                onPress={takePicture}
                style={{
                  width: 70,
                  height: 70,
                  bottom: 0,
                  borderRadius: 50,
                  backgroundColor: '#fff',
                }}
              />
            </View>
          </View>
        </Camera>
      )}
    </View>
  );
};

export default ImageEntries;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    // flex: 0.1,
    // alignSelf: 'flex-end',
    // alignItems: 'center',
    marginTop: 25,
    height: 25,
    width: 35,
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
});
