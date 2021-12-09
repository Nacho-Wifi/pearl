import {
  collection,
  where,
  query,
  getDocs,
  onSnapshot,
} from 'firebase/firestore';
import { auth, db } from '../../firebase';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import React, { Component } from 'react';
import {
  Platform,
  Text,
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Button,
  TouchableOpacity,
  Linking,
  Alert,
  SafeAreaView,
} from 'react-native';

export function week() {
  let weekInQuestion = [];
  for (let i = 0; i < 7; i++) {
    let date = new Date();
    let dayInQuestion = new Date(date.setDate(date.getDate() - i));
    weekInQuestion.push(dayInQuestion.toDateString());
  }
  return weekInQuestion;
}

export async function getWeekEntries() {
  let daysOfTheWeek = week();
  let entries = [];
  let moods = [];

  const q = query(
    collection(db, 'Journals'),
    where('userId', '==', auth.currentUser.email),
    where('createdAt', 'in', daysOfTheWeek)
  );

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    entries.push(doc.data());
  });
  entries.forEach((entry) => moods.push(entry.mood.scale));

  return moods;
}

const checkIfOk = async () => {
  await tf.ready();

  let weekInMoods = await getWeekEntries();
  await learnConcern(weekInMoods);
};

export default checkIfOk;

export async function learnConcern(numArr) {
  const model = tf.sequential();
  model.add(
    tf.layers.dense({ units: 1, inputShape: [7], activation: 'sigmoid' })
  );

  model.compile({
    loss: 'meanSquaredError',
    optimizer: 'sgd',
  });

  const moods = tf.tensor2d(
    [
      [1, 1, 1, 1, 1, 1, 1],
      [1, 1, 2, 1, 2, 1, 1],
      [2, 2, 2, 1, 1, 1, 1],
      [2, 3, 5, 4, 4, 5, 5],
      [5, 2, 3, 4, 5, 1, 5],
      [3, 4, 3, 4, 3, 4, 5],
      [3, 3, 3, 3, 3, 3, 3],
    ],
    [7, 7]
  );
  const concernLevel = tf.tensor2d([1, 1, 1, 0, 0, 0, 0], [7, 1]);

  await model.fit(moods, concernLevel, { epochs: 500 });

  // let concerned = model.predict(tf.tensor2d([numArr], [1, 7]));
  let concerned = model.predict(tf.tensor2d([numArr], [1, 7]));
  let binaryConcerned = await concerned.data();
  console.log('ARE WE HERE ????', binaryConcerned);
  if (binaryConcerned[0] > 0.3) {
    Alert.alert(
      "We noticed you haven't been feeling well recently - want help? Check out our resources page for support near you."
    );
  }
}
