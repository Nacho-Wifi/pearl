import React from 'react';
import { Text, View } from 'react-native';

import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';

async function learnConcern() {
  tf.ready();
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
  console.log(concerned);
}
learnConcern();

const HelloWorldApp = () => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text>User Profile!</Text>
    </View>
  );
};
export default HelloWorldApp;
