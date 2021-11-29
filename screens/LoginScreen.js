import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import {
  StyleSheet,
  TextInput,
  Text,
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  TouchableOpacityBase,
} from 'react-native';
import { Link } from '@react-navigation/native';
import LottieView from 'lottie-react-native';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (email, password) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('logged in with: ', user.email);
      })
      .catch((error) => alert(error.message));
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      <View>
        <LottieView
          style={styles.lottieMindful}
          source={require('../assets/lottie/mindfulness.json')}
          autoPlay
        />
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={(text) => setPassword(text)}
          style={styles.input}
          secureTextEntry
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => handleLogin(email, password)}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <Text>
          Don't have an account? Sign up{' '}
          <Link
            to={{ screen: 'SignUp' }}
            style={{ color: 'blue', textDecorationLine: 'underline' }}
          >
            here
          </Link>
          !
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    width: '80%',
  },
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  buttonContainer: {
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  button: {
    backgroundColor: '#FBD1B7',
    width: '100%',
    padding: 15,
    borderRadius: 10,
  },
  // buttonOutline: {
  //   backgroundColor: 'white',
  //   marginTop: 5,
  //   borderColor: '#0782F9',
  //   borderWidth: 2,
  // },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
    textAlign: 'center',
  },
  // buttonOutlineText: {
  //   color: '#0782F9',
  //   fontWeight: '700',
  //   fontSize: 16,
  // },
  lottieMindful: {
    width: 150,
    height: 150,
  },
});
