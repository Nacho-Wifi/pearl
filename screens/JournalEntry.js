import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { auth, db } from '../firebase';
import {
  doc,
  addDoc,
  getDoc,
  getDocs,
  collection,
  setDoc,
} from 'firebase/firestore';

//firebase storage
import {
  ref,
  getDownloadURL,
  uploadBytesResumable,
  getStorage,
} from 'firebase/storage';
import uuid from 'react-native-uuid';

const JournalEntry = ({ route }) => {
  const emojiMapping = {
    'U+1F622': '😢',
    'U+1F614': '😔',
    'U+1F610': '😐',
    'U+1F60C': '😌',
    'U+1F601': '😁',
  };
  const navigation = useNavigation();
  //this route.params gives us access to the props passed down by our Activities component using react navigation
  const { activities, journalId, photoURI, inputText } = route.params;
  const [moods, setMoods] = useState([]);
  const [textEntry, setTextEntry] = useState(false);
  const [userActivities, setUserActivities] = useState([]);
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

  //this second useEffect is used to check if an optional TextEntry has already been filled
  //to toggle between adding text entry and edit text entry
  useEffect(() => {
    if (photoURI || inputText) {
      setTextEntry(true);
    } else setTextEntry(false);
  }, [photoURI, inputText]);

  //running into an issue where the activities prop being passed down from Activities component
  //becomes undefined when I route to JournalEntry from TextEntry
  //because TextEntry is ONLY passing down photoURI and textinput
  useEffect(() => {
    setUserActivities(activities);
  }, []);

  const handleOptionalEntry = () => {
    navigation.navigate('TextEntry', {
      photoURI,
      inputText,
    });
  };

  const savePhoto = async (mood) => {
    const imageUri = photoURI;
    //fetch image from the uri
    const response = await fetch(imageUri);
    //create a blob of the image which we will then pass on to firestore and will then upload the image
    const blob = await response.blob();
    //uuid generates a string of random characters
    const path = `journal/${auth.currentUser.uid}/${uuid.v4()}`;
    const storage = getStorage();
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, blob);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      },
      (error) => {
        console.log('Error found', error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setJournal(mood, downloadURL);
        });
      }
    );
  };

  const setJournal = async (mood, downloadURL) => {
    // If journalId is undefined, create a new journal entry
    if (!journalId) {
      await addDoc(journalsCollectionRef, {
        mood,
        activities: userActivities,
        photoURL: downloadURL || '',
        textInput: inputText,
        createdAt: new Date().toDateString(),
        userId: auth.currentUser.email,
      });
      // Otherwise, update the existing journal entry
    } else {
      console.log('ACTIVITIES: ', activities);
      await setDoc(doc(db, 'Journals', journalId.journalId), {
        mood,
        activities: userActivities, // an array of objects of the activities
        photoURL: downloadURL || '',
        createdAt: new Date().toDateString(),
        textInput: inputText,
        userId: auth.currentUser.email,
      });
    }
    navigation.replace('HomeScreen');
  };

  return (
    <View style={styles.container}>
      <Text> Mood:</Text>
      {moods.map((mood) => {
        return (
          <TouchableOpacity
            key={mood.id}
            style={styles.button}
            onPress={() => {
              if (photoURI) {
                //will call setJournal in savePhoto after getting downloadURL
                savePhoto(mood);
              } else {
                setJournal(mood);
              }
            }}
          >
            <Text>{emojiMapping[mood.imageUrl]}</Text>
          </TouchableOpacity>
        );
      })}
      {!textEntry ? (
        <TouchableOpacity style={styles.button} onPress={handleOptionalEntry}>
          <Text>Add Text Entry</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleOptionalEntry}>
          <Text>Edit Text Entry</Text>
        </TouchableOpacity>
      )}
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
    backgroundColor: '#BDD8F1',
    width: '24%',
    padding: 15,
    borderRadius: 10,
    margin: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // buttonText: {
  //   color: 'white',
  //   fontWeight: '700',
  //   fontSize: 16,
  // },
});
