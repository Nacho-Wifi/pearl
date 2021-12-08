import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

import MoodChart from './MoodChart';
import ActivityTracker from './ActivityTracker';
import { color } from 'react-native-reanimated';
import MoodActivity2 from './MoodActivity2'

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
  //const [day, setDay] = useState(oneWeekAgo);
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
        console.log('entries.length inside unsub', entries.length)
      });
      setEntriesLength(entries.length);
      //setLoading(false)
      //console.log('entries.length, loading=false', entries.length)
    };
    getUserEntries();
    console.log('entries.length', entries.length)


    //return () => {console.log('unmounting')};
  }, []);



  return  (

    <View style={[styles.container, { flexDirection: 'column'}]}>
      <ActivityTracker entries={entries}/>
      <MoodActivity2 entries={entries}/>
    </View>

  )





};

export default MyData;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    // backgroundColor: '#8fc5d3'
    backgroundColor: '#b0d7e1'
  },
});
