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
} from 'react-native';
import { Link } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/core';

const TextEntry = ({ route }) => {
  const [input, setInput] = useState('');
  const { photoURI, inputText, clearImage } = route.params;
  const navigation = useNavigation();
  useEffect(() => {
    setInput(inputText);
  }, []);
  const handleCancel = () => {
    //clearImage clears the preview state in ImageEntries so we are able to take a new picture later on
    if (clearImage) {
      clearImage();
    }
    //navigates back to JournalEntry with the photo.uri and text input set to null
    navigation.navigate('JournalEntry', {
      photoURI: '',
      inputText: '',
    });
  };

  const handleBack = () => {
    //navigates back to ImagePreview from TextEntry
    navigation.goBack();
  };

  const handleSubmit = () => {
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
                  <Button title="Go Back" onPress={handleBack} />
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
              <Button title="Cancel" onPress={handleCancel} />
              <Button title="Submit" onPress={handleSubmit} />
            </View>
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
  },
  addBtn: {
    width: 250,
    height: 250,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 100,
    margin: 12,
    borderWidth: 2,
    padding: 10,
    borderRadius: 10,
  },
  displayImage: {
    width: 250,
    height: 250,
    borderRadius: 20,
  },
  imgContainer: { alignItems: 'center' },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
