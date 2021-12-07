import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/core';
import LoadingIcon from './components/LoadingIcon';
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
import LottieView from 'lottie-react-native';

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
  const { activities, journalData, photoURI, inputText, deletePost } =
    route.params;

  // State
  const [moods, setMoods] = useState([]);
  const [textEntry, setTextEntry] = useState(false);
  const [userActivities, setUserActivities] = useState([]);
  const [userJournalData, setUserJournalData] = useState(null);
  const [selectedMood, setSelectedMood] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [savedPhoto, setSavedPhoto] = useState('');
  const [savedText, setSavedText] = useState('');
  const [savingJournal, setSavingJournal] = useState(false);

  // Collections
  const moodsCollectionRef = collection(db, 'Moods');
  const journalsCollectionRef = collection(db, 'Journals');
  useEffect(() => {
    //every time we make a request return this promise, data to be resolved ...
    const getMoods = async () => {
      const data = await getDocs(moodsCollectionRef);
      setMoods(data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))); // makes sure our data doesnt come back in a format that is weird af, loops thru documents in collection , sets equal to array of doc data adn the id of each document ...
      setIsLoading(false);
    };
    getMoods();
  }, []);

  useEffect(() => {
    //this will store journalData of user in userJournalData state
    //so it doesn't get lost when we nagivate to the Textentries page
    if (journalData) {
      setUserJournalData(journalData);
      setSelectedMood(journalData.journalEntries.mood);
      setSavedPhoto(journalData.journalEntries.photoURL);
      setSavedText(journalData.journalEntries.textInput);
    }
  }, []);

  useEffect(() => {
    //if textEntry clicks on handleDelete, deletePost:true will be sent back to clear our savedPhoto and savedText state
    if (deletePost) {
      setSavedPhoto('');
      setSavedText('');
    }
  }, [deletePost]);

  //this second useEffect is used to check if an optional TextEntry and photoEntry has already been filled (either in localstate or db)
  //to toggle between adding text entry and edit text entry
  useEffect(() => {
    if (photoURI || inputText || savedPhoto || savedText) {
      setTextEntry(true);
    } else setTextEntry(false);
  }, [photoURI, inputText, savedPhoto, savedText]);

  useEffect(() => {
    setUserActivities(activities);
  }, []);

  const handleOptionalEntry = () => {
    navigation.navigate('TextEntry', {
      // if a photoURI doesn't exist (we haven't taken a photo yet), load photo from database if one exists
      photoURI: !photoURI ? savedPhoto : photoURI, // Allows user to view photo when toggling back and forth between JournalEntry and TextEntry
      inputText: !inputText ? savedText : inputText,
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
    if (!userJournalData) {
      await addDoc(journalsCollectionRef, {
        mood: selectedMood,
        activities: userActivities,
        photoURL: downloadURL || '',
        textInput: inputText || '',
        createdAt: new Date().toDateString(),
        userId: auth.currentUser.email,
      });
      // Otherwise, update the existing journal entry
    } else {
      //console.log('ACTIVITIES: ', activities);
      await setDoc(doc(db, 'Journals', userJournalData.journalId), {
        mood,
        activities: userActivities, // an array of objects of the activities
        photoURL: downloadURL || savedPhoto,
        createdAt: new Date().toDateString(),
        textInput: inputText || savedText,
        userId: auth.currentUser.email,
      });
    }
    navigation.replace('HomeScreen');
  };

  if (isLoading) {
    return <LoadingIcon></LoadingIcon>;
  }

  return (
    <View style={styles.container}>
      {moods.map((mood) => {
        return (
          <TouchableOpacity
            key={mood.id}
            style={
              selectedMood.id === mood.id
                ? styles.selectedButton
                : styles.button
            }
            onPress={() => {
              setSelectedMood(mood);
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
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          if (!Object.keys(selectedMood).length) {
            Alert.alert(
              'No mood selected',
              'You must select a mood to continue',
              [{ text: 'OK', style: 'cancel', onPress: () => {} }]
            );
          } else {
            if (photoURI) {
              if (photoURI.substring(0, 5) === 'https') {
                //if photo has https, it has already been saved from last journal entry
                setJournal(selectedMood);
              } else {
                //will call setJournal in savePhoto after getting downloadURL
                setSavingJournal(true);
                savePhoto(selectedMood);
              }
            } else {
              setJournal(selectedMood);
            }
          }
        }}
      >
        <Text>Save Journal</Text>
      </TouchableOpacity>
      {savingJournal && (
        <LottieView
          style={styles.lottieUploading}
          source={require('../assets/lottie/uploading.json')}
          autoPlay
        />
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
  // button: {
  //   backgroundColor: '#BDD8F1',
  //   width: '24%',
  //   padding: 15,
  //   borderRadius: 10,
  //   margin: 16,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  button: {
    backgroundColor: '#BDD8F1',
    width: '60%',
    padding: 15,
    margin: 16,
    alignItems: 'center',
    borderRadius: 10,
  },
  selectedButton: {
    backgroundColor: '#7bb6ed', // Temporary!
    width: '60%',
    margin: 16,
    padding: 15,
    alignItems: 'center',
    // borderColor: '#BDD8F1',
    // borderWidth: 2,
    borderRadius: 10,
  },
  lottieUploading: {
    position: 'absolute',
    width: 500,
    height: 1000,
    backgroundColor: 'white',
  },
  // buttonText: {
  //   color: 'white',
  //   fontWeight: '700',
  //   fontSize: 16,
  // },
});
