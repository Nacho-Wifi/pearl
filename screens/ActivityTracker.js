<<<<<<< HEAD
import React, { useState, useEffect, useRef } from 'react';
=======
import React, { useState, useEffect } from "react";
>>>>>>> 58aa80f4b5aecd328efa956ad0c849b7728cfd55

import { CurrentRenderContext, useNavigation } from "@react-navigation/core";

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
<<<<<<< HEAD
} from 'victory-native';
=======
  VictoryVoronoiContainer,
  VictoryTooltip
} from "victory-native";
import LottieView from 'lottie-react-native';
>>>>>>> 58aa80f4b5aecd328efa956ad0c849b7728cfd55

const { width, height } = Dimensions.get("screen");

const ActivityTracker = () => {
  const [entries, setEntries] = useState([]);

  // retrieve all journal entries where userId matches that of logged in user
  useEffect(() => {
<<<<<<< HEAD
    const getUserEntries = async () => {
      console.log('WE ARE ACTIVITIES QUERYING!!!');
      const userQuery = query(
        journalCollectionRef,
        where('userId', '==', auth.currentUser.email)
      );
      const querySnapshot = await getDocs(userQuery);
      setEntries(
        querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
=======
    const getUserEntries = () => {
      const q = query(
        collection(db, "Journals"),
        where("userId", "==", auth.currentUser.email)
>>>>>>> 58aa80f4b5aecd328efa956ad0c849b7728cfd55
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

  // iterate through ALL activities for that user, on all days, make pie chart (if activities exist)
  let activityHash = {};
  entries
    .map((entry) => entry.activities)
    .flat()
    .forEach((activity) => {
      activity === undefined ? null :
      activityHash[activity.image] = activityHash[activity.image] + 1 || 1 }
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
    !activityTracker.length ?
    <View style={styles.container}>
      <LottieView
        style={styles.lottiePie}
        source={require('../assets/lottie/pieChart.json')}
        autoPlay
      />
      <Text style={styles.textStyling}>
        Select some activities to see your data!
      </Text>
    </View> :
    <View
      style={styles.container}
      >
      <VictoryPie
        width={300}
        theme={VictoryTheme.material}
        data={activityTracker}
<<<<<<< HEAD
        labelRadius={({ innerRadius }) => innerRadius + 40}
        style={{
          labels: {
            fontSize: 28,
            align: 'center',
          },
        }}
        innerRadius={35}
=======
        events={[{
          target: "data",
          eventHandlers: {
            onPressIn: () => {
              return [
                {
                  target: "data",
                  mutation: ({ style }) => {
                    return style.fill === "#ff0dbf" ? null : { style: { fill: "#ff0dbf"}};
                  }
                },
                {
                  target: "labels",
                  mutation: ({text}) => {
                    return text === "clicked" ? null : { text: "clicked"};
                  }
                }
              ]
            }
          }
        }]}
        // style={{
        //   labels: {
        //     fontSize: 24,
        //     position: "fixed"
        //     //align: "center",
        //   },
        // }}
        //innerRadius={35}
>>>>>>> 58aa80f4b5aecd328efa956ad0c849b7728cfd55
        colorScale={[
          "#FFB319",
          "#FFE194",
          "#CAB8F8",
          "#97BFB4",
          "#B8DFD8",
          "tomato",
          "#B5DEFF",
          "#ca6702",
          "pink",
        ]}
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
    paddingTop: 30,
    fontSize: 20
  },
  textStyling: {
    display: "flex",
    color: '#b5179e',
    alignContent: "center",
    textAlign: "center",
    fontFamily: "Avenir",
    //fontSize: 16
  },
  lottiePie: {
    width: 150,
    height: 150
  }
});
