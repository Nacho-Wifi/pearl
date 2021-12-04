import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/core";
import { auth, db } from "../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { StyleSheet, View, Dimensions } from "react-native";
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
//import { Defs, LinearGradient, Stop } from 'react-native-svg';

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

  let mappedEntries = entries.map((entry) => {
    return {
      date: new Date(entry.createdAt) || "",
      scale: entry.mood.scale || 0,
      mood: entry.mood.name || "",
      activities: entry.activities || [],
    };
  });

  return (
    <View style={styles.container}>
      <VictoryChart
      theme={VictoryTheme.material}
      scale={{x: 'time'}}
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
          // style={{ data: { fill: 'url(#gradientStroke)' } }}
          style={{ data: { fill: "#B8DFD8", stroke: "pink", strokeWidth: 3 } }}
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
    justifyContent: "center",
    alignItems: "center",
  },
});
