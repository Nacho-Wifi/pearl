import React, { useState, useEffect } from 'react';
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
} from 'victory-native';

const { width, height } = Dimensions.get('screen');

const MoodChart = () => {
  const [entries, setEntries] = useState([]);
  const journalCollectionRef = collection(db, 'Journals');
  let userId;

  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) userId = user.email;
    else {
      console.log('no logged in user');
    }
  });

  // retrieve all journal entries where userId matches that of logged in user
  useEffect(() => {
    const getUserEntries = async () => {
      const userQuery = query(
        journalCollectionRef,
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(userQuery);
      setEntries(
        querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    };
    getUserEntries();
  }, []);

  // iterate through ALL activities for that user, on all days, make pie chart
  let activityHash = {};
  entries
    .map((entry) => entry.activities)
    .flat()
    .forEach((activity) =>
      activityHash[activity.image]
        ? (activityHash[activity.image] += 1)
        : (activityHash[activity.image] = 1)
    );

  // pull out emoticons and frequency of activity associated with that emoticon
  let activityTracker = [];
  for (let [key, val] of Object.entries(activityHash)) {
    activityTracker.push({
      activity: key,
      frequency: val,
    });
  }

  return (
    <View style={styles.container}>
      <VictoryPie
        theme={VictoryTheme.material}
        // data={activityTracker.slice(0,7)}
        data={activityTracker}
        labelRadius={({ innerRadius }) => innerRadius + 60}
        innerRadius={40}
        colorScale={[
          '#FFB319',
          '#FFE194',
          '#CAB8F8',
          '#b5179e',
          '#B8DFD8',
          'tomato',
          '#B5DEFF',
          '#ca6702',
          'pink',
        ]}
        // width={width/1.1}
        // height={300}
        x="activity"
        y="frequency"
        style={{
          labels: {
            fontSize: 18,
          },
        }}
      />
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
