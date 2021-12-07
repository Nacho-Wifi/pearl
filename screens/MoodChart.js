import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/core';
import { auth, db } from '../firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

import LoadingIcon from './components/LoadingIcon';

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
import {
  VictoryChart,
  VictoryTheme,
  VictoryPie,
  VictoryArea,
  VictoryAxis,
  VictoryVoronoiContainer,
  VictoryTooltip,
} from 'victory-native';
import LottieView from 'lottie-react-native';
import { FlashMode } from 'expo-camera/build/Camera.types';

const { width, height } = Dimensions.get('screen');

const MoodChart = () => {
  const [entries, setEntries] = useState([]);
  const [day, setDay] = useState(oneWeekAgo);
  const [entriesLength, setEntriesLength] = useState(null)


  useEffect(() => {

    const getUserEntries = () => {
      const q = query(
        collection(db, 'Journals'),
        where('userId', '==', auth.currentUser.email)
      );

      // firestore listens for changes to journal entries and state is updated with new info so it shows up when immediately navigating to MyData screen
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const journalEntry = [];
        querySnapshot.forEach((doc) => {
          journalEntry.push(doc.data());
        });
        setEntries(journalEntry);
        setEntriesLength(entries.length);
      });
    };
    getUserEntries();
    console.log('entries.length', entries.length)
  }, [entries.length]);


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
  console.log('dateDescription:', dateDescription);

  if(!entriesLength) return <LoadingIcon/>

  return (
    entriesLength <= 1 ?
    <View style={styles.container}>
      <LottieView
        style={styles.lottieHistogram}
        source={require('../assets/lottie/histogram.json')}
        autoPlay
      />
      <Text style={styles.textStyling}>Your mood chart will appear here after two days of journaling!</Text>
    </View>
   :
    <View style={styles.container}>
      <VictoryChart
        theme={VictoryTheme.material}
        containerComponent={
          <VictoryVoronoiContainer
            dimension="x"
            labels={({ datum }) => datum.activities[0].image}
            labelComponent={
              <VictoryTooltip
                style={{ fontSize: 30 }}
                // cornerRadius={16}
                pointerLength={0}
                constrainToVisibleArea
                flyoutStyle={{
                  fill: 'none',
                  stroke: 'none',
                }}
              />
            }
          />
        }
        scale={{ x: 'time' }}
        minDomain={{ x: day }}
        maxDomain={{ y: 5.2 }}
        height={300}
      >
        <VictoryAxis
          tickFormat={(date) =>
            date.toLocaleString('en-us', { day: 'numeric' }) +
            '\n' +
            date.toLocaleString('en-us', dateDescription)
          }
          fixLabelOverlap={true}
        />
        <VictoryAxis
          dependentAxis
          domain={[0, 5]}
          tickValues={['😢', '😔', '😐', '😌', '😁']}
          tickFormat={(t) => t}
        />

        <VictoryArea
          style={{ data: { fill: '#B8DFD8', stroke: 'pink', strokeWidth: 2 } }}
          data={mappedEntries}
          x="date"
          y="scale"
          animate
          interpolation="catmullRom"
          labelComponent={<VictoryTooltip />}
        />
      </VictoryChart>

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
  textStyling: {
    display: 'flex',
    color: '#b5179e',
    alignContent: 'center',
    textAlign: 'center',
    fontFamily: 'Avenir',
    fontSize: 16,
  },
  lottieHistogram: {
    width: 150,
    height: 150,
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
    backgroundColor: 'grey',
    textAlign: 'center',
  },
  leftButton: {
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: 'darkgrey',
    textAlign: 'center',
  },
});
