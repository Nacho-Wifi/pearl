import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Modal,
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
import { SafeAreaView } from 'react-navigation';
import checkIfOk from './components/ConcernTracker';

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
    checkIfOk();
    setSavingJournal(false);
    navigation.replace('HomeScreen');
  };

  if (isLoading) {
    return <LoadingIcon></LoadingIcon>;
  }

  return (
    <SafeAreaView>
      <Text style={styles.header}>Mood</Text>
      <Text style={styles.instructions}>
        Select the mood that most closely matches how you're feeling today:
      </Text>
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
              <Text style={styles.emoji}>{emojiMapping[mood.imageUrl]}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={styles.saveAndEditContainer}>
        {!textEntry ? (
          <TouchableOpacity
            style={styles.entryButton}
            onPress={handleOptionalEntry}
          >
            <Image source={require('../assets/icons/addEntry.png')} />
            <Text style={styles.entryButtonText}>Add Entry</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.entryButton}
            onPress={handleOptionalEntry}
          >
            <Image source={require('../assets/icons/editicon.png')} />
            <Text style={styles.entryButtonText}>Edit Entry</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={styles.saveButton}
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
          <Image source={require('../assets/icons/floppydisk.png')} />
          <Text style={styles.entryButtonText}>Save Entry</Text>
        </TouchableOpacity>
        {savingJournal && (
          <Modal animationType="slide" visible={savingJournal}>
            <LottieView
              source={require('../assets/lottie/uploading.json')}
              autoPlay
            />
          </Modal>
        )}
      </View>
    </SafeAreaView>
  );
};

export default JournalEntry;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 40,
  },
  header: {
    fontSize: 50,
    textAlign: 'center',
    padding: 10,
    marginTop: 50,
  },
  instructions: {
    textAlign: 'center',
    fontSize: 25,
    marginTop: 10,
    marginBottom: 40,
    padding: 5,
  },
  entryButtonText: {
    fontSize: 15,
  },
  saveAndEditContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  // saveButton: {
  //   alignItems: 'left',
  // },
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
    flexBasis: '20%',
    // width: '60%',
    // padding: 15,
    // margin: 16,
    alignItems: 'center',
    borderRadius: 10,
  },
  entryButton: {
    // flexBasis: '20%',
    // width: '60%',
    // padding: 15,
    // margin: 16,
    alignItems: 'flex-end',
    padding: 10,
    borderRadius: 10,
  },
  saveButton: {
    alignItems: 'flex-start',
    padding: 10,
  },
  emoji: {
    fontSize: 40,
  },
  selectedButton: {
    backgroundColor: '#FBD1B7', // Temporary!
    // width: '60%',
    // margin: 16,
    flexBasis: '20%',
    // padding: 15,
    alignItems: 'center',
    // borderColor: '#BDD8F1',
    // borderWidth: 2,
    borderRadius: 10,
  },
  lottieUploading: {
    // position: 'absolute',
    // alignSelf: 'center',
    // justifyContent: 'center',
    // height: '100%',
    // backgroundColor: 'white',
    // borderWidth: 5,
  },
  lottieContainer: {
    // position: 'absolute',
    // alignSelf: 'flex-start',
    // justifyContent: 'flex-start',
    // height: '70%',
    // width: '70%',
    // backgroundColor: 'white',
    // borderWidth: 5,
  },
  // buttonText: {
  //   color: 'white',
  //   fontWeight: '700',
  //   fontSize: 16,
  // },
});
