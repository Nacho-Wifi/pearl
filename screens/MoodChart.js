import React, { useState, useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/core';
import { auth, db } from '../firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { StyleSheet, View, Dimensions } from 'react-native';
import {
  doc,
  addDoc,
  getDocs,
  setDoc,
  collection,
  where,
  query,
} from 'firebase/firestore';
import {
  VictoryChart,
  VictoryTheme,
  VictoryPie,
  VictoryArea,
  VictoryAxis,
  VictoryLabel,
} from 'victory-native';
//import { Defs, LinearGradient, Stop } from 'react-native-svg';

const { width, height } = Dimensions.get('screen');

const MoodChart = () => {
  const [entries, setEntries] = useState([]);
  //const [todayEntry, setTodayEntry] ... takes today's mood
  let counter = 0;
  const journalCollectionRef = collection(db, 'Journals');

  // const didMountRef = useRef(false);

  // useEffect(() => {

  //   const getUserEntries = async () => {

  //     journalCollectionRef.where("userId", "==", auth.currentUser.email).onSnapshot

  //     const userQuery = query(
  //       journalCollectionRef,
  //       where('userId', '==', auth.currentUser.email)
  //     );
  //     const querySnapshot = await getDocs(userQuery);
  //ONLY RETURN MOOD HERE!!!!
  //     setEntries(
  //       querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
  //     );
  //   };
  //   getUserEntries();
  // }, [entries]);

  //load initial data

  //counter
  //useeffect1 - this use effect runs just one time - because it has an empty array at the the end. this use effect grabs all of the users (recent?) mood data and plots it on chart

  //second use effect - this one runs if counter > 0 .. here is where we set TODAYS entry ... we set the array at the end equal to [todaysEntry ] .. then this should only change if today's entry changed ... and we can reset our journalEntries state with this && today's state

  useEffect(() => {
    const getUserEntries = async () => {
      console.log('WE ARE MOODS QUERYING!!!!!!');
      const userQuery = query(
        journalCollectionRef,
        where('userId', '==', auth.currentUser.email)
      );
      const querySnapshot = await getDocs(userQuery);
      const allEntries = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      console.log('THIS IS ALL THE ENTRIES', allEntries);
      // setEntries(
      //   querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      // );
    };
    getUserEntries();
  }, []);

  let mappedEntries = entries.map((entry) => {
    return {
      date: new Date(entry.createdAt) || '',
      scale: entry.mood.scale || 0,
      mood: entry.mood.name || '',
      activities: entry.activities || [],
    };
  });

  return (
    <View style={styles.container}>
      {/* <VictoryChart theme={VictoryTheme.material} scale={{ x: 'time' }}> */}
      <VictoryChart theme={VictoryTheme.material}>
        {/* <Defs>
          <LinearGradient id="gradientStroke">
            <Stop offset="25%" stopColor="orange" />
            <Stop offset="50%" stopColor="gold" />

            <Stop offset="100%" stopColor="#FFB319" />
          </LinearGradient>
        </Defs> */}
        <VictoryArea
          // style={{ data: { fill: 'url(#gradientStroke)' } }}
          style={{ data: { fill: '#B8DFD8', stroke: 'pink', strokeWidth: 3 } }}
          data={mappedEntries}
          x="date"
          y="scale"
          height={200}
          animate
          interpolation="basis"
          padding={{ top: 0, bottom: 30 }}
        />

        {/* <VictoryAxis
          style={{
            axis: { stroke: 'none' },
            tickLabels: {
              fill: 'grey',
            },
          }}
          //label="Date"
        /> */}
        {/* <VictoryAxis
          dependentAxis
          style={{
            axis: { stroke: 'none' },
            tickLabels: { fill: 'none' },
          }}
          label="Mood"
        /> */}
      </VictoryChart>
    </View>
  );
};
export default MoodChart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
