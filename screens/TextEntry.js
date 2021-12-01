import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
  Button,
} from 'react-native';
import { Link } from '@react-navigation/native';

const TextEntry = ({ route }) => {
  const [inputText, setInputText] = useState('');
  // const [currentImage, setCurrentImage] = useState('');
  const { photo } = route.params;

  //using currentImage to keep track of whether or not there is a photo object,
  //by having this state, we allow users to delete their image in the TextEntry page with the option of just
  //writing a text entry without having to leave the component
  // useEffect(() => {
  //   setCurrentImage(photo.uri);
  // }, []);
  const handleCancel = () => {
    console.log(
      'Maybe if the user does not want to make a text post, nagivate back to journalEntry component'
    );
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            {!photo ? (
              <View style={{ alignItems: 'center' }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <Button
                    style={{ justifyContent: 'flex-end' }}
                    title="Submit"
                    onPress={() => null}
                  />
                  <Link
                    to={{ screen: 'ImageEntries' }}
                    style={{
                      color: 'black',
                      textDecorationLine: 'underline',
                      flex: 1,
                      justifyContent: 'center',
                    }}
                  >
                    Add a picture!
                  </Link>
                </View>
              </View>
            ) : (
              <>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <Button title="Cancel" onPress={handleCancel} />
                  <Button title="Submit" onPress={() => null} />
                </View>
                <View style={{ alignItems: 'center' }}>
                  <Image
                    source={{ uri: photo.uri }}
                    style={{
                      width: 250,
                      height: 250,
                      borderRadius: 20,
                    }}
                  />
                </View>
              </>
            )}

            <View style={styles.inner}>
              <TextInput
                multiline={true}
                style={styles.input}
                onChangeText={(input) => setInputText(input)}
                value={inputText}
                placeholder="Tell me more..."
              />
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
  input: {
    height: 100,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
