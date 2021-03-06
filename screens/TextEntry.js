import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Platform,
  Keyboard,
  Button,
  Alert,
} from 'react-native';
import { Link } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/core';
import LottieView from 'lottie-react-native';

const TextEntry = ({ route }) => {
  const [input, setInput] = useState('');
  const { photoURI, inputText } = route.params || '';
  const navigation = useNavigation();
  useEffect(() => {
    setInput(inputText);
  }, []);
  const handleDelete = () => {
    //navigates back to JournalEntry with the photo.uri and text input set to empty string
    navigation.navigate('JournalEntry', {
      photoURI: '',
      inputText: '',
      deletePost: true,
    });
  };

  const alertDelete = () => {
    Alert.alert(
      'Remove?',
      'Are you sure you want to delete your entry? This cannot be undone.',
      [
        {
          text: 'Cancel',
          // onPress: () => {},
          style: 'cancel',
        },
        { text: 'OK', onPress: () => handleDelete() },
      ]
    );
  };

  const handleRetake = () => {
    //navigates back to ImagePreview from TextEntry
    navigation.navigate('ImageEntries');
  };

  const alertRetake = () => {
    Alert.alert(
      'Discard Photo?',
      'If you retake your photo, your picture will be deleted.',
      [
        {
          text: 'Cancel',
          // onPress: () => {},
          style: 'cancel',
        },
        { text: 'OK', onPress: () => handleRetake() },
      ]
    );
  };

  const handleContinue = () => {
    //navigates back to JournalEntry with the photo.uri and text input as params
    navigation.navigate('JournalEntry', {
      photoURI,
      inputText: input,
    });
  };

  const handleTakePicture = () => {
    navigation.navigate('ImageEntries');
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            {!photoURI ? (
              <>
                <View style={styles.addBtnContainer}>
                  <View style={styles.addBtn}>
                    <TouchableOpacity onPress={handleTakePicture}>
                      <Image
                        source={require('../assets/icons/addPicture.png')}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            ) : (
              <>
                <View style={styles.btnContainer}>
                  {/* <Button title="Retake Photo" onPress={alertRetake} /> */}
                  <TouchableOpacity onPress={alertRetake}>
                    <Image
                      source={require('../assets/icons/retakePhoto.png')}
                    />
                    <Text>Retake</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.imgContainer}>
                  <Image
                    source={{ uri: photoURI }}
                    style={styles.displayImage}
                  />
                </View>
              </>
            )}
            <View style={styles.inputContainer}>
              <TextInput
                multiline={true}
                style={styles.input}
                onChangeText={(words) => setInput(words)}
                value={input}
                placeholder="Tell me more..."
              />
            </View>
            <View style={styles.btnContainer}>
              {/* only display alert for delete if there is something to delete */}

              <TouchableOpacity
                onPress={photoURI || inputText ? alertDelete : handleDelete}
              >
                <Image source={require('../assets/icons/delete.png')} />
                <Text> Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleContinue}
                style={{ marginTop: 5 }}
              >
                <Image source={require('../assets/icons/continue.png')} />
                <Text>Continue</Text>
              </TouchableOpacity>
            </View>
            <LottieView
              source={require('../assets/lottie/sun.json')}
              autoPlay
              loop
              style={styles.lottieBackground}
            />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default TextEntry;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inner: {
    padding: 20,
  },
  addBtnContainer: {
    alignSelf: 'center',
    justifyContent: 'center',
    height: '45%',
    width: '70%',
  },
  addBtn: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: 'white',
  },
  input: {
    position: 'relative',
    height: '100%',
    margin: 5,
    borderWidth: 2,
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'white',
    fontSize: 17,
  },
  inputContainer: {
    height: '20%',
    margin: '2%',
  },
  displayImage: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },
  imgContainer: {
    alignSelf: 'center',
    justifyContent: 'center',
    height: '40%',
    width: '70%',
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  lottieBackground: {
    position: 'relative',
  },
});
