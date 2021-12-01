import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/core';
import { useSelector } from 'react-redux';
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
  const journalCollectionRef = collection(db, 'Journals');
  let userId;

  // const auth = getAuth();
  // onAuthStateChanged(auth, (user) => {
  //   if (user) userId = user.email;
  //   else {
  //     console.log('no logged in user');
  //   }
  // });

  console.log('auth.current.email', auth.currentUser.email)
  useEffect(() => {

    const getUserEntries = async () => {
      const userQuery = query(
        journalCollectionRef,
        // where('userId', '==', userId)

        where('userId', '==', auth.currentUser.email)
      );
      const querySnapshot = await getDocs(userQuery);
      setEntries(
        querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    };
    getUserEntries();

  }, []);

  // const monthToNum =  {
  //   "Jan": "01",
  //   "Feb": "02",
  //   "Mar": "03",
  //   "Apr": "04",
  //   "May": "05",
  //   "Jun": "06",
  //   "Jul": "07",
  //   "Aug": "08",
  //   "Sep": "09",
  //   "Oct": "10",
  //   "Nov": "11",
  //   "Dec": "12"
  // }

  // function convertToDate(string) {
  //   let year = string.slice(-4);
  //   let day = string.slice(8, 10);
  //   let monthToConvert = string.slice(4,7);
  //   let month = monthToNum[monthToConvert];
  //   let newStringDate = `${year}-${month}-${day}`;
  //   let date = new Date(newStringDate);
  //   return date;
  // }

  let mappedEntries = entries.map((entry) => {
    console.log('entry', entry)
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
      <VictoryChart theme = {VictoryTheme.material} >
        {/* <Defs>
          <LinearGradient id="gradientStroke">
            <Stop offset="25%" stopColor="orange" />
            <Stop offset="50%" stopColor="gold" />

            <Stop offset="100%" stopColor="#FFB319" />
          </LinearGradient>
        </Defs> */}
        <VictoryArea
          // style={{ data: { fill: 'url(#gradientStroke)' } }}
          style={{ data: { fill: 'orange'}}}
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
