import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, ScrollView, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { auth, db } from '../firebase';
import { doc, addDoc, getDocs, collection, setDoc } from 'firebase/firestore';

const Activities = ({ route }) => {
  const emojiMapping = {
    "U+1F6C0": "🛀",
    "U+1F3A8": "🎨",
    "U+1F4D6": "📖",
    "U+1F9D8": "🧘",
    "U+1F6B6": "🚶",
    "U+1F3A7": "🎧",
    "U+1F372": "🍲",
    "U+1F465": "👥",
    "U+1F6B2": "🚲",
  }
  const navigation = useNavigation();
  const journalId = route.params;
  // State
  const [activities, setActivities] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [isActivitySelected, setIsActivitySelected] = useState(false);
  const [selectedActivityId, setSelectedActivityId] = useState('');

  const activitiesCollectionRef = collection(db, 'Activities');
  useEffect(() => {
    //every time we make a request return this promise, data to be resolved ...
    const getActivities = async () => {
      const data = await getDocs(activitiesCollectionRef);
      setActivities(data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))); // makes sure our data doesnt come back in a format that is weird af, loops thru documents in collection , sets equal to array of doc data adn the id of each document ...
    };
    getActivities();
  }, []);
  const handleNext = () => {
    // activities are being added onto state array here - if we want to remove one we need to remove it from state
    navigation.navigate('JournalEntry', {
      //pass down selected Activities as props to the moods/journal entry component
      activities: selectedActivities,
      journalId: journalId,
    });
  };
  const handleActivitySelect = (activity) => {
    //we want to make sure we only add the activity once to the journal entry even if user clicks on it a million times
    if (!selectedActivities.includes(activity)) {
      setSelectedActivities((oldState) => [...oldState, activity]);
    }
  };
  //
  // function selectedBtn(id) {
  //   const newData = [...data];
  //   newData[index].isSelected = newData[index].isSelected ? false : true;
  //   setData(newData);
  // }
  //
  return (
    <SafeAreaView style={styles.container}>
      {/* Do we even need this text here? */}
      <Text> Activities:</Text>
      <ScrollView contentContainerStyle={{ alignItems: 'center' }}>
        {/* <Text style={{ justifyContent: 'center' }}> Activities:</Text> */}
        {activities.map((activity) => {
          console.log(selectedActivityId)
          return (
            <TouchableOpacity
              key={activity.id}
              style={selectedActivityId === activity.id ? styles.selectedButton : styles.button}
              onPress={() => {
                handleActivitySelect(activity);
                setSelectedActivityId(activity.id);
                setIsActivitySelected(true); // this indicates that an activity button has been selected so it can change color
              }}
            ><Text style={styles.buttonText}> {emojiMapping[activity.emojiUnicode]}</Text>
              <Text style={styles.buttonText}>{activity.activityName} </Text>
            </TouchableOpacity>
          );
        })}
        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView >
  );
};

export default Activities;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#BDD8F1',
    width: '60%',
    padding: 15,
    margin: 16,
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center'
  },
  selectedButton: {
    backgroundColor: 'pink',
    width: '60%',
    padding: 15,
    margin: 16,
    alignItems: 'center',
    borderRadius: 10,
  }
});
