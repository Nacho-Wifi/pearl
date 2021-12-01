import React, { useState } from 'react';
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
} from 'react-native';
import { Link } from '@react-navigation/native';

const TextEntry = ({ route }) => {
  const [inputText, setInputText] = useState('');
  const { photo } = route.params;
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            {!photo ? (
              <Link
                to={{ screen: 'ImageEntries' }}
                style={{
                  color: 'blue',
                  textDecorationLine: 'underline',
                  flex: 1,
                  justifyContent: 'center',
                }}
              >
                Add a picture!
              </Link>
            ) : (
              <View
                style={{ flex: 1, alignItems: 'center', marginBottom: 500 }}
              >
                <Image
                  source={{ uri: photo.uri }}
                  style={{
                    width: 350,
                    height: 350,
                    borderRadius: 20,
                  }}
                />
              </View>
            )}
            <View style={styles.inner}>
              <TextInput
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
    // flex: 1,
    justifyContent: 'space-around',
  },
  input: {
    height: 150,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    // height: 40,
    // borderColor: '#000000',
    // borderBottomWidth: 1,
    // marginBottom: 36,
  },
});
