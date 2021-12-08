import React, { useState, useEffect } from "react";

import MoodChart from "./MoodChart";
import ActivityTracker from "./ActivityTracker";
import { color } from "react-native-reanimated";

import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  Button,
} from "react-native";

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
import { auth, db } from "../firebase";

const MyData = () => {
  const [entries, setEntries] = useState([]);
  const [day, setDay] = useState(oneWeekAgo);
  const [entriesLength, setEntriesLength] = useState(null);

  //const navigation = useNavigation();

  useEffect(() => {
    const getUserEntries = () => {
      //setLoading(true);
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
      setEntriesLength(entries.length);
    };
    getUserEntries();
  }, []);

  const changeTimeline = (time) => {
    if (time === "week") setDay(oneWeekAgo);
    else if (time === "month") setDay(oneMonthAgo);
  };

  const mappedEntries = entries.map((entry) => {
    return {
      date: new Date(entry.createdAt) || "",
      scale: entry.mood.scale || 0,
      mood: entry.mood.name || "",
      activities: entry.activities || [],
    };
  });

  let dateDescription = {};

  const week = () => {
    let date = new Date();
    date.setDate(date.getDate() - 7);
    dateDescription = { weekday: "short" };
    return date;
  };
  const oneWeekAgo = week();

  const month = () => {
    let date = new Date();
    date.setDate(date.getDate() - 30);
    dateDescription = { month: "short" };
    return date;
  };
  const oneMonthAgo = month();

  return (
    <View style={[styles.container, { flexDirection: "column" }]}>
      <Text style={styles.title}>Your Activities & Moods</Text>
      <ActivityTracker
        entries={entries}
        mappedEntries={mappedEntries}
        dateDescription={dateDescription}
        day={day}
        oneMonthAgo={oneMonthAgo}
      />
      {/* <Text style={styles.title}>Your Moods</Text> */}
      <MoodChart
        entries={entries}
        mappedEntries={mappedEntries}
        dateDescription={dateDescription}
        day={day}
      />

      {entries.length > 1 ? (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.leftButton}
            onPress={() => {
              changeTimeline("week");
            }}
          >
            <Text style={{ color: "white" }}>VIEW WEEK</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rightButton}
            onPress={() => {
              changeTimeline("month");
            }}
          >
            <Text style={{ color: "white" }}>VIEW MONTH</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View />
      )}
    </View>
  );
};

export default MyData;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#d1eaf2",
    alignContent: "center",
    paddingTop: 30
    //justifyContent: 'center'
  },
  buttonContainer: {
    flexDirection: "row",
    fontFamily: "Avenir",
    fontSize: 14,
    justifyContent: "center",
    paddingBottom: 30
  },
  rightButton: {
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "#9a91bd",
    textAlign: "center",
  },
  leftButton: {
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: "#3c599b",
    textAlign: "center",
  },
  title: {
    textAlign: 'center',
    fontSize: 24,
    paddingTop: 20,
    paddingBottom: 20,
    color: "#3c599b"
  }
});
