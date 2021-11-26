import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { auth, db } from '../firebase';
import { doc, addDoc, getDocs, collection, setDoc } from 'firebase/firestore';

const JournalEntry = () => {
  const navigation = useNavigation();
  const [moods, setMoods] = useState([]);
  const moodsCollectionRef = collection(db, 'Moods');
  useEffect(() => {
    //every time we make a request return this promise, data to be resolved ...
    const getMoods = async () => {
      const data = await getDocs(moodsCollectionRef);
      setMoods(data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))); // makes sure our data doesnt come back in a format that is weird af, loops thru documents in collection , sets equal to array of doc data adn the id of each document ...
    };
    getMoods();
  }, []);

  const setJournal = (mood) => {
    // 'new-journal-id' is temporary
    setDoc(doc(db, '/Journals', 'new-journal-id'), {
      mood: mood,
    });
  };

  return (
    <View style={styles.container}>
      <Text> Mood:</Text>
      {moods.map((mood) => {
        // Add key
        return (
          // make it so that when a user clicks on the smiley face image
          // our Journal collection adds a document noting the mood
          // added & the date (& other details)
          <TouchableOpacity
            key={mood.id}
            style={styles.button}
            onPress={() => {
              setJournal(mood);
            }}
          >
            {/* <Text style={styles.buttonText}>{mood.name}</Text> */}
            <Image
              source={require('../assets/Cute-face-with-smile-emoji-vectors.png')}
              style={{ width: 40, height: 40 }}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default JournalEntry;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#0782F9',
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
});
