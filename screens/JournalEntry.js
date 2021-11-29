import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { auth, db } from '../firebase';
import {
  doc,
  addDoc,
  getDocs,
  collection,
  serverTimestamp,
} from 'firebase/firestore';

const JournalEntry = ({ route }) => {
  const emojiMapping = {
    "U+1F622": "😢",
    "U+1F614": "😔",
    "U+1F610": "😐",
    "U+1F60C": "😌",
    "U+1F601": "😁",
  }
  const navigation = useNavigation();
  //this route.params gives us access to the props passed down by our Activities component using react navigation
  const { activities } = route.params;
  const [moods, setMoods] = useState([]);
  const moodsCollectionRef = collection(db, 'Moods');
  const journalsCollectionRef = collection(db, 'Journals');
  useEffect(() => {
    //every time we make a request return this promise, data to be resolved ...
    const getMoods = async () => {
      const data = await getDocs(moodsCollectionRef);
      setMoods(data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))); // makes sure our data doesnt come back in a format that is weird af, loops thru documents in collection , sets equal to array of doc data adn the id of each document ...
    };
    getMoods();
  }, []);

  const setJournal = async (mood) => {
    // pass only moodId?
    await addDoc(journalsCollectionRef, {
      mood,
      activities,
      createdAt: serverTimestamp(),
      userId: auth.currentUser.email,
    });
    navigation.replace('Home');
  };

  return (
    <View style={styles.container}>
      <Text> Mood:</Text>
      {moods.map((mood) => {
        console.log(emojiMapping[mood.imageUrl])
        return (
          <TouchableOpacity
            key={mood.id}
            style={styles.button}
            onPress={() => {
              setJournal(mood);
            }}
          >
            <Text>{emojiMapping[mood.imageUrl]}</Text>

            {/* <Text style={styles.buttonText}>{mood.name}</Text> */}
            {/* <Image source={{ content: emojiMapping[mood.imageUrl] }} /> */}
            {/* style={{ width: 40, height: 40 }} */}
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
