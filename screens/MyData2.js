import React, { useState, useEffect } from 'react';


import MoodChart from './MoodChart';
import ActivityTracker from './ActivityTracker';
import { color } from 'react-native-reanimated';
import MoodActivity2 from './MoodActivity2'

import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  Button,
} from 'react-native';

import {
  doc,
  addDoc,
  getDocs,
  setDoc,
  collection,
  where,
  query,
  onSnapshot,
} from 'firebase/firestore';
import { auth, db } from '../firebase';
//import { NavigationContext, useNavigation } from 'react-navigation';

const MyData = () => {

  const [entries, setEntries] = useState([]);
  const [day, setDay] = useState(oneWeekAgo);
  const [entriesLength, setEntriesLength] = useState(null)
  const [loading, setLoading] = useState(true)

  //const navigation = useNavigation();


  useEffect(() => {

    const getUserEntries = () => {
      //setLoading(true);
      const q = query(
        collection(db, 'Journals'),
        where('userId', '==', auth.currentUser.email)
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const journalEntry = [];
        querySnapshot.forEach((doc) => {
          journalEntry.push(doc.data());
        });
        setEntries(journalEntry);
        //setEntriesLength(entries.length);
        //console.log('entries.length inside unsub', entries.length)
      });
      setEntriesLength(entries.length);
      //setLoading(false)
      //console.log('entries.length, loading=false', entries.length)
    };
    getUserEntries();
    //console.log('entries.length', entries.length)


    //return () => {console.log('unmounting')};
  }, []);


  const changeTimeline = (time) => {
    if (time === 'week') setDay(oneWeekAgo);
    else if (time === 'month') setDay(oneMonthAgo);
  };

  const mappedEntries = entries.map((entry) => {
    return {
      date: new Date(entry.createdAt) || '',
      scale: entry.mood.scale || 0,
      mood: entry.mood.name || '',
      activities: entry.activities || [],
    };
  });

  let dateDescription = {};

  const week = () => {
    let date = new Date();
    date.setDate(date.getDate() - 7);
    dateDescription = { weekday: 'short' };
    return date;
  };
  const oneWeekAgo = week();

  const month = () => {
    let date = new Date();
    date.setDate(date.getDate() - 30);
    dateDescription = { month: 'short' };
    return date;
  };
  const oneMonthAgo = month();

  return  (

    <View style={[styles.container, { flexDirection: 'column'}]}>
      <ActivityTracker
        entries={entries}
        mappedEntries={mappedEntries}
        dateDescription={dateDescription}
        day={day}

      />
      <MoodActivity2
        entries={entries}
        mappedEntries={mappedEntries}
        dateDescription={dateDescription}
        day={day}
        />

      { entries.length > 1 ?
        <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.leftButton}
          onPress={() => {
            changeTimeline('week');
          }}
        >
          <Text style={{ color: 'white' }}>VIEW WEEK</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.rightButton}
          onPress={() => {
            changeTimeline('month');
          }}
        >
          <Text style={{ color: 'white' }}>VIEW MONTH</Text>
        </TouchableOpacity>
      </View>
      : <View/>
      }

    </View>

  )

};

export default MyData;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#b0d7e1',
    alignContent: 'center',
    //justifyContent: 'center'
  },
  buttonContainer: {
    flexDirection: 'row',
    fontFamily: 'Avenir',
    fontSize: 14,
  },
  rightButton: {
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: '#9a91bd',
    textAlign: 'center',
  },
  leftButton: {
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: '#3c599b',
    textAlign: 'center',
  },
});
