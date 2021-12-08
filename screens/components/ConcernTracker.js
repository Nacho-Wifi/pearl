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

export default class Test extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isTfReady: false,
    };
  }

  async componentDidMount() {
    // Wait for tf to be ready.
    await tf.ready();
    // Signal to the app that tensorflow.js can now be used.
    this.setState({
      isTfReady: true,
    });
  }

  async learnConcern() {
    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 1, inputShape: [1] }));

    model.compile({
      loss: 'meanSquaredError',
      optimizer: 'sgd',
    });

    const moods = tf.tensor2d([1, 1, 1, 1, 4, 4, 4, 4], [8, 1]);
    const concernLevel = tf.tensor2d([1, 1, 1, 1, 0, 0, 0, 0], [8, 1]);

    await model.fit(moods, concernLevel, { epochs: 250 });

    let concerned = model.predict(tf.tensor2d([1], [1, 1]));
    console.log('CONCERNED!!!!!!', concerned);
  }

  render() {
    if (this.state.isTfReady) {
      this.learnConcern();
      return <Text>hi</Text>;
    } else {
      this.learnConcern();
      return <Text>sad!</Text>;
    }
  }
}

// async function learnConcern() {
//   tf.ready();
//   const model = tf.sequential();
//   model.add(tf.layers.dense({ units: 1, inputShape: [1] }));

//   model.compile({
//     loss: 'meanSquaredError',
//     optimizer: 'sgd',
//   });

//   const moods = tf.tensor2d([1, 1, 1, 1, 4, 4, 4, 4], [8, 1]);
//   const concernLevel = tf.tensor2d([1, 1, 1, 1, 0, 0, 0, 0], [8, 1]);

//   await model.fit(moods, concernLevel, { epochs: 250 });

//   let concerned = model.predict(tf.tensor2d([1], [1, 1]));
//   console.log('CONCERNED!!!!!!', concerned);
// }
