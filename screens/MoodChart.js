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


  useEffect(() => {

    const getUserEntries = async () => {
      const userQuery = query(
        journalCollectionRef,
        where('userId', '==', auth.currentUser.email)
      );
      const querySnapshot = await getDocs(userQuery);
      setEntries(
        querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
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
          style={{ data: { fill: '#B8DFD8', stroke: 'pink', strokeWidth: 3}}}
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

