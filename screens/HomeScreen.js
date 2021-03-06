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
  Image,
  Icon,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import { auth, db } from '../firebase';
import LottieView from 'lottie-react-native';
import {
  doc,
  collection,
  query,
  where,
  getDocs,
  getDoc,
  Firestore,
} from 'firebase/firestore';
import { StatusBar } from 'expo-status-bar';
import { set } from 'react-native-reanimated';
import About from './About';

const HomeScreen = () => {
  const [journalEntries, setEntries] = useState();
  const [journalId, setJournalId] = useState();
  const [loading, setLoading] = useState(false);
  const journalEntriesCollectionRef = collection(db, 'Journals');

  const auth = getAuth();

  let userId;

  useEffect(() => {
    //this is all inside useEffect because we DON'T want the edit or enter journal button to load until we have data on the user
    onAuthStateChanged(auth, (user) => {
      setLoading(true);
      if (user) {
        // if user exists, find their user document by email
        userId = user.email;

        //once we have the user info, check if that user has an entry for today ... date is set to string to make it comparable to what we have placed in firebase
        const getEntries = async () => {
          let today = new Date().toDateString();
          const entryQuery = query(
            journalEntriesCollectionRef,
            where('userId', '==', userId),
            where('createdAt', '==', today)
          );

          const querySnapshot = await getDocs(entryQuery);
          querySnapshot.forEach((doc) => {
            //we're setting journal entries to include an array that lists moods and activities in the user's journal entry for today
            //then, we're setting our journalId state to the Id of today's journal entry. we need to pass both of these to the JournalEntry component if/when our user wants to update their entry
            setEntries(doc.data());
            setJournalId(doc.id);
          });
          setLoading(false);
        };
        getEntries();
      } else {
        console.log('no logged in user');
      }
    });
  }, []);
  const navigation = useNavigation();

  const makeNewEntry = () => {
    navigation.replace('Activities');
  };

  //updateEntry passes the data we got here on journalEntries and journalId so activities has that info when it loads; then it can easily access the user's open journal & show what the user has already submitted for the day
  const updateEntry = () => {
    navigation.navigate('Activities', {
      journalEntries,
      journalId,
    });
  };

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        navigation.replace('Login');
      })
      .catch((error) => alert(error.message));
  };

  if (!loading) {
    return (
      <View style={styles.container}>
        <LottieView
          style={styles.lottieOcean}
          resizeMode="cover"
          source={require('../assets/lottie/ocean.json')}
          autoPlay
        >

          <Pressable onPress={handleSignOut}>
            <Image
              source={require('../assets/icons/logout.png')}
              style={{
                // position: 'absolute',
                left: 20,
                marginTop: 35,
                height: 30,
                width: 30,
              }}
            />
          </Pressable>

          <LottieView
            source={require('../assets/lottie/21254-clamshell-opening-with-pearl/data.json')}
            autoPlay
            loop
            style={styles.lottiePearl}
          />

          {auth.currentUser.displayName === null ? (
            <Text style={styles.helloText}>How are you feeling today?</Text>
          ) : (
            <Text style={styles.helloText}>
              How are you feeling today, {auth.currentUser.displayName}?
            </Text>
          )}

          <>
            {!journalEntries ? (
              <TouchableOpacity style={styles.button} onPress={makeNewEntry}>
                <Text style={styles.buttonText}>Enter Journal</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.button} onPress={updateEntry}>
                <Text style={styles.buttonText}>Edit Journal</Text>
              </TouchableOpacity>
            )}
            <About />
          </>

          {/* <TouchableOpacity style={styles.button} onPress={handleSignOut}>
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity> */}
        </LottieView>
      </View>
    );
  } else {
    return <View></View>;
  }
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#FBD1B7',
    width: '60%',
    padding: 15,
    borderRadius: 10,
    // marginBottom: 40,
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 20,
  },
  helloText: {
    marginTop: 0,
    color: 'white',
    fontSize: 30,
    alignSelf: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: 16,
  },
  lottiePearl: {
    marginTop: 16,
    alignSelf: 'center',
    width: 250,
    height: 250,
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
    alignItems: 'center',
  },
  IconBehave: {
    padding: 14,
  },
  lottieOcean: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
});
