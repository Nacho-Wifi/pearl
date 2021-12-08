import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  TextInput,
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
                <TextInput
                  multiline={true}
                  style={styles.input}
                  onChangeText={(words) => setInput(words)}
                  value={input}
                  placeholder="Tell me more..."
                />
              </>
            ) : (
              <>
                <View style={styles.btnContainer}>
                  <Button title="Retake Photo" onPress={alertRetake} />
                </View>
                <View style={styles.imgContainer}>
                  <Image
                    source={{ uri: photoURI }}
                    style={styles.displayImage}
                  />
                </View>
                <View style={styles.inner}>
                  <TextInput
                    multiline={true}
                    style={styles.input}
                    onChangeText={(words) => setInput(words)}
                    value={input}
                    placeholder="Tell me more..."
                  />
                </View>
              </>
            )}

            <View style={styles.btnContainer}>
              {/* only display alert for delete if there is something to delete */}
              <Button
                title="Delete"
                onPress={photoURI || inputText ? alertDelete : handleDelete}
              />
              <Button title="Continue" onPress={handleContinue} />
            </View>
            <LottieView
              source={require('../assets/lottie/sun.json')}
              autoPlay
              loop
              // resizeMode="cover"
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
    padding: 24,
  },
  addBtnContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  addBtn: {
    width: 300,
    height: 350,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    backgroundColor: 'white',
  },
  input: {
    height: 120,
    margin: 10,
    borderWidth: 2,
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  displayImage: {
    width: 300,
    height: 350,
    borderRadius: 20,
  },
  imgContainer: { alignItems: 'center' },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  lottieBackground: {
    position: 'relative',
  },
});
