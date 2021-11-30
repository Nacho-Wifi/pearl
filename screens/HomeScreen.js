import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, signOut } from '@firebase/auth';
import { useNavigation } from '@react-navigation/core';
import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Pressable,
} from 'react-native';
import { auth, db } from '../firebase';
import LottieView from 'lottie-react-native';
import { doc, collection, query, where, getDocs } from 'firebase/firestore';
import Icon from 'react-native-ico-material-design';
import { StatusBar } from 'expo-status-bar';

const HomeScreen = () => {
  const [journalEntries, setEntries] = useState([]);
  const [journalId, setJournalId] = useState('');
  const journalEntriesCollectionRef = collection(db, 'Journals');
  let userId;
  let docId;
  let docData;

  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) userId = user.email;
    else {
      console.log('no logged in user');
    }
  });

  useEffect(() => {
    const getEntries = async () => {
      let today = new Date().toDateString();

      const entryQuery = query(
        journalEntriesCollectionRef,
        where('userId', '==', userId),
        where('createdAt', '==', today)
      );

      const querySnapshot = await getDocs(entryQuery);
      querySnapshot.forEach((doc) => {
        setEntries(doc.data());
        setJournalId(doc.id);
        // docId = doc.id;
        // docData = doc.data();
        // console.log(docId);
        // console.log(docData);
      });
      // setEntries(docData);
      // console.log('DOCID', docId);
      // setJournalId(docId);
      // console.log(journalId);
      console.log(journalEntries);
    };
    getEntries();
  }, []);

  const navigation = useNavigation();

  const leaveHomePage = () => {
    navigation.replace('Activities');
  };
  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigation.replace('Login');
      })
      .catch((error) => alert(error.message));
  };

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../assets/lottie/21254-clamshell-opening-with-pearl/data.json')}
        autoPlay
        loop
        style={styles.lottiePearl}
      />
      <Text>How are you feeling today?</Text>
      <>
        {journalEntries.length === 0 ? (
          <TouchableOpacity style={styles.button} onPress={leaveHomePage}>
            <Text style={styles.buttonText}>Enter Journal</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button} onPress={leaveHomePage}>
            <Text style={styles.buttonText}>Edit Journal</Text>
          </TouchableOpacity>
        )}
      </>
      <TouchableOpacity style={styles.button} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
      <View style={styles.NavContainer}>
        <View style={styles.NavBar}>
          <Pressable style={styles.IconBehave} onPress={() => {}}>
            <Icon
              name="favorite-heart-button"
              height={40}
              width={40}
              color={'white'}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D3F6F3',
  },
  button: {
    backgroundColor: '#FBD1B7',
    width: '60%',
    padding: 15,
    borderRadius: 10,
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  lottiePearl: {
    width: 200,
    height: 200,
  },
  NavContainer: {
    position: 'absolute',
    alignItems: 'center',
    bottom: 20,
  },
  NavBar: {
    flexDirection: 'row',
    backgroundColor: '#FBD1B7',
    width: '100%',
    justifyContent: 'space-evenly',
  },
  IconBehave: {
    padding: 14,
  },
});
