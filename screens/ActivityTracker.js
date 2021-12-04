import React, { useState, useEffect } from "react";

import { CurrentRenderContext, useNavigation } from "@react-navigation/core";

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

const { width, height } = Dimensions.get("screen");

const ActivityTracker = () => {
  const [entries, setEntries] = useState([]);

  // retrieve all journal entries where userId matches that of logged in user
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
        labelRadius={({ innerRadius }) => innerRadius + 40}
        style={{
          labels: {
            fontSize: 28,
            align: "center",
          },
        }}
        innerRadius={35}
        colorScale={[
          "#FFB319",
          "#FFE194",
          "#CAB8F8",
          // '#b5179e',
          "#97BFB4",
          "#B8DFD8",
          "tomato",
          "#B5DEFF",
          "#ca6702",
          "pink",
        ]}
        // width={width/1.1}
        // height={300}
        x="activity"
        y="frequency"
      />
    </View>
  );
};
export default ActivityTracker;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
