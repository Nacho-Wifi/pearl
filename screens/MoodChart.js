import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/core';
import { useSelector } from 'react-redux';
import { auth, db } from '../firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import {
  StyleSheet,
  View,
  Dimensions
} from 'react-native';
import {
  doc,
  addDoc,
  getDocs,
  setDoc,
  collection,
  where,
  query
} from 'firebase/firestore';
import {
  VictoryChart,
  VictoryTheme,
  VictoryPie,
  VictoryArea
} from 'victory-native'

const { width, height } = Dimensions.get("screen");

const MoodChart = () => {

  const [entries, setEntries] = useState([]);
  const journalCollectionRef = collection(db, 'Journals');
  let userId;

  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) userId = user.email;
    else {
      console.log('no logged in user')
    }
  })

  console.log('userId:', userId)
  useEffect(() => {
    // const getEntries = async () => {
    //   const data = await getDocs(journalCollectionRef);
    //   setEntries(data.docs.map((doc) =>
    //   ({...doc.data(), id: doc.id})
    //   ))
    // }
    // getEntries();

    const getUserEntries = async () => {
      const userQuery = query(journalCollectionRef, where ("userId", "==", userId))
      const querySnapshot = await getDocs(userQuery);
      querySnapshot.forEach((doc) => {
        console.log(doc.id, "=> ", doc.data());
      });
      setEntries(querySnapshot.docs.map((doc) =>
      ({...doc.data(), id: doc.id})
      ))
    }
    getUserEntries();

  }, [])


  let mappedEntries = entries.map(entry => {
    return {
      "date": entry.createdAt.toDate() || "",
      "scale": entry.mood.scale || 0,
      "mood": entry.mood.name || "",
      "activity": entry.activities[0].activityName|| "",
      "activity-emoticon": entry.activities[0].image || ""
    }
  })

  let activitySelection = [...new Set(mappedEntries.map(entry => entry["activity-emoticon"]))]
  console.log('activitySelection:', activitySelection);
  return (
    <View style={styles.container}>
          <VictoryPie
            theme={VictoryTheme.material}
            data = {mappedEntries}
            // data={mappedEntries.slice(0,5)}
            width={width/1.1}
            height={300}
            x="activity-emoticon"
            y="scale"
            innerRadius={70}
            style={{ labels: {
              fontSize: 24,
              //fill: "blue",
              }}}
            />
          <VictoryChart
            theme={VictoryTheme.material}
            >
              <VictoryArea
                style={{data: { fill: "#FEE9B2"} }}
                data={mappedEntries}
                x="date"
                y="scale"
                animate
                interpolation="basis"
                padding={{ top: 0, bottom: 30}}
              />
          </VictoryChart>
    </View>
  )
};
export default MoodChart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
