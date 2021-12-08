import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { auth, db } from '../firebase';
import { doc, addDoc, getDocs, collection, setDoc } from 'firebase/firestore';
import { color } from 'react-native-reanimated';
import LoadingIcon from './components/LoadingIcon';

const Activities = ({ route }) => {
  const emojiMapping = {
    'U+1F6C0': '🛀',
    'U+1F3A8': '🎨',
    'U+1F4D6': '📖',
    'U+1F9D8': '🧘',
    'U+1F6B6': '🚶',
    'U+1F3A7': '🎧',
    'U+1F372': '🍲',
    'U+1F465': '👥',
    'U+1F6B2': '🚲',
  };
  const navigation = useNavigation();
  const journalData = route.params;
  // State
  const [activities, setActivities] = useState([]);
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const activitiesCollectionRef = collection(db, 'Activities');
  // console.log('SELECTED ACTIVITIES: ', selectedActivities)
  // console.log('ACTIVITIES PASSED DOWN AS PROPS: ', journalData.journalEntries.activities)

  // Gets all activities data
  useEffect(() => {
    //every time we make a request return this promise, data to be resolved ...
    const getActivities = async () => {
      const data = await getDocs(activitiesCollectionRef);
      setActivities(data.docs.map((doc) => ({ ...doc.data(), id: doc.id }))); // makes sure our data doesnt come back in a format that is weird af, loops thru documents in collection , sets equal to array of doc data adn the id of each document ...
      // if this is true, craete activities id state then check if the id == activity.id?
      // would only work if user has an entry already
      if (journalData)
        setSelectedActivities(journalData.journalEntries.activities);
      setIsLoading(false);
    };
    getActivities();
  }, []);

  const handleNext = () => {
    // activities are being added onto state array here - if we want to remove one we need to remove it from state
    navigation.navigate('JournalEntry', {
      //pass down selected Activities as props to the moods/journal entry component
      activities: selectedActivities,
      journalData,
    });
  };
  const handleActivitySelect = (activity) => {
    //we want to make sure we only add the activity once to the journal entry even if user clicks on it a million times
    if (!selectedActivities.some((element) => element.id === activity.id)) {
      setSelectedActivities((oldState) => [...oldState, activity]);
    } else {
      // If user selects the activity again, it will remove it from the selectedActivities state array
      setSelectedActivities(
        selectedActivities.filter((current) => activity.id !== current.id)
      );
    }
  };

  if (isLoading) {
    return <LoadingIcon></LoadingIcon>;
  }

  return (
    // <SafeAreaView>
    <SafeAreaView>
      <ScrollView>
        <Text style={styles.header}>Activities</Text>
        <Text style={styles.instructions}>
          Select the activities you've done today:
        </Text>
        <SafeAreaView style={styles.container}>
          {activities.map((activity) => {
            return (
              <TouchableOpacity
                key={activity.id}
                // Check if activity is in selectedActivities array - if it is make it darker
                style={
                  selectedActivities.some(
                    (element) => element.id === activity.id
                  )
                    ? [styles.selectedButton, styles.selectedButtonText]
                    : styles.button
                }
                onPress={() => {
                  handleActivitySelect(activity);
                }}
              >
                <Text style={styles.buttonText}>{activity.image}</Text>
                <Text style={styles.buttonLittleText}>
                  {activity.activityName}{' '}
                </Text>
              </TouchableOpacity>
            );
          })}
        </SafeAreaView>
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Activities;

const styles = StyleSheet.create({
  header: {
    fontSize: 40,
    textAlign: 'center',
    padding: 10,
    marginTop: 15,
  },
  instructions: {
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 20,
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    height: '60%',
  },
  // buttonContainer: {
  //   padding: 100,
  //   // flex: 1,
  //   // flexWrap: 'wrap',
  //   // flexDirection: 'row',
  //   // justifyContent: 'center',
  // },
  button: {
    flexBasis: '25%',
    backgroundColor: 'white',
    // width: '25%',
    // height: 100,
    padding: '1%',
    margin: 8,
    alignItems: 'center',
    borderColor: 'white',
    borderRadius: 10,
    borderWidth: 2,
  },
  buttonText: {
    color: 'black',
    fontWeight: '200',
    fontSize: 25,
    textAlign: 'center',
  },
  buttonLittleText: {
    color: 'black',
    fontSize: 10,
    textAlign: 'center',
  },
  nextButton: {
    backgroundColor: '#FBD1B7',
    // width: '25%',
    // height: 100,
    padding: '1%',
    margin: 30,
    alignItems: 'center',
    borderColor: '#FBD1B7',
    borderRadius: 10,
    borderWidth: 2,
    alignSelf: 'center',
    width: 120,
    // marginTop: 100,
    // position: 'relative',
    // marginTop: 100,
    // marginRight: 100,
  },
  nextButtonText: {
    color: 'black',
    fontWeight: '700',
    fontSize: 20,
  },
  selectedButton: {
    backgroundColor: '#D3F6F3',
    width: '25%',
    padding: '1%',
    margin: 8,
    alignItems: 'center',
    borderColor: '#D3F6F3',
    borderWidth: 2,
    borderRadius: 10,
    shadowColor: '#BDD8F1',
    shadowOpacity: 0.5,
    elevation: 6,
    shadowRadius: 8,
    shadowOffset: { width: 1, height: 6 },
  },
});
