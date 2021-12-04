import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/core";
import { auth, db } from "../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { StyleSheet, View, Dimensions, Text } from "react-native";
import {
  doc,
  addDoc,
  getDocs,
  setDoc,
  collection,
  where,
  query,
  onSnapshot,
} from "firebase/firestore";
import {
  VictoryChart,
  VictoryTheme,
  VictoryPie,
  VictoryArea,
  VictoryAxis,
  VictoryLabel,
} from "victory-native";
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get("screen");

const MoodChart = () => {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const getUserEntries = () => {
      const q = query(
        collection(db, "Journals"),
        where("userId", "==", auth.currentUser.email)
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const journalEntry = [];
        querySnapshot.forEach((doc) => {
          journalEntry.push(doc.data());
        });
        setEntries(journalEntry);
      });
    };
    getUserEntries();
  }, []);

  let totalMood = 0;
  const mappedEntries = entries.map((entry) => {
    if(entry.mood.scale) totalMood += entry.mood.scale;
    return {
      date: new Date(entry.createdAt) || "",
      scale: entry.mood.scale || 0,
      mood: entry.mood.name || "",
      activities: entry.activities || [],
    };
  });

  console.log('totalMood:', totalMood)
  // if haven't logged in past 7 days
  // see message
const week = () => {
    let date = new Date();
    date.setDate(date.getDate() - 7);
    return date;
}

const oneWeekAgo = week();


  return (
    totalMood === 0 ?
    <View style={styles.container}>
      <LottieView
        style={styles.lottieHistogram}
        source={require('../assets/lottie/histogram.json')}
        autoPlay
      />
      <Text style={styles.textStyling}>
      Select a mood for today to see your data!
    </Text>
    </View>
     :
    <View style={styles.container}>
      <VictoryChart
      theme={VictoryTheme.material}
      scale={{x: 'time'}}
      minDomain={{x: oneWeekAgo}}
      >
        <VictoryAxis
          tickFormat={date => date.toLocaleString('en-us', { day: 'numeric' })
          +'\n'+
          date.toLocaleString('en-us',
          { weekday: 'short'})
          }
          fixLabelOverlap={true}
        />
        <VictoryAxis dependentAxis
            domain={[0, 5]}
            tickValues={['😢', '😔', '😐', '😌', '😁']}
            tickFormat={(t) => t}
        />
        <VictoryArea
          style={{ data: { fill: "#B8DFD8", stroke: "pink", strokeWidth: 2 } }}
          data={mappedEntries}
          x="date"
          y="scale"
          height={200}
          animate
          interpolation="basis"
          padding={{ top: 0, bottom: 30 }}
          minDomain={{x: oneWeekAgo}}
        />
      </VictoryChart>
    </View>
  );
};
export default MoodChart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textStyling: {
    display: "flex",
    color: '#b5179e',
    alignContent: "center",
    textAlign: "center",
    fontFamily: "Avenir",
    fontSize: 16
  },
  lottieHistogram: {
    width: 150,
    height: 150
  }
});
