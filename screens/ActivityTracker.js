import React, { useState, useEffect } from 'react';
import { CurrentRenderContext, useNavigation } from '@react-navigation/core';
import { auth, db } from '../firebase';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { StyleSheet, View, Dimensions, Text } from 'react-native';
import { compareAsc, format, isThisISOWeek } from 'date-fns'
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
  VictoryLabel,
  VictoryVoronoiContainer,
  VictoryTooltip,
} from 'victory-native';
import LottieView from 'lottie-react-native';

import LoadingIcon from './components/LoadingIcon';

const { width, height } = Dimensions.get('screen');

const ActivityTracker = ({ entries, day, oneMonthAgo}) => {

  const [loading, setLoading] = useState(true);
  const [entriesLength, setEntriesLength] = useState(0);


  useEffect(() => {
    setEntriesLength(entries.length);
    setLoading(false);
  }, [entries.length])

  const activityHash = {};

  entries.sort((a, b) => {
    return new Date(b.createdAt) -new Date(a.createdAt)
  })



  let chosenDay=''
  day ? chosenDay = day.toDateString() : chosenDay = oneMonthAgo.toDateString();
  //console.log('day.getDate()', day.toDateString())


  console.log('oneMonthAgo', oneMonthAgo)
  entries.forEach((entry) => {

    console.log('created at:', entry.createdAt)

    //console.log('day:', day.toDateString())
    console.log('chosenDay', chosenDay)


  })

  let timeline = entries.filter(entry => entry.createdAt.toString() >= chosenDay)

  timeline.forEach(t => console.log('t', t.createdAt))
  //entries.forEach(e => console.log('e', e.createdAt))

  timeline
    .map((entry) => entry.activities)
    .flat()
    .forEach((activity) => {
      activity === undefined
        ? null
        : (activityHash[activity.image] =
            activityHash[activity.image] + 1 || 1);
    });

  // pull out emoticons and frequency of activity associated with that emoticon
  const activityTracker = [];
  for (let [key, val] of Object.entries(activityHash)) {
    activityTracker.push({
      activity: key,
      frequency: val,
    });
  }

  // sorts most to least frequent
  activityTracker.sort((current, next) => {
    return next.frequency -current.frequency;
  })


  let pie = [];

  if (activityTracker.length > 9) {
    pie = activityTracker.slice(0, 9);
    let sum = activityTracker.slice(9, activityTracker.length).reduce((current, next) => {
      return current + next.frequency;
    }, 0)

    //console.log(sum);
    pie.push({activity: '🐚', frequency: sum})
  } else {
    pie = activityTracker.slice();
  }

  //console.log('pie.length', pie.length)
  console.log('pie', pie)



  return !activityTracker.length ? (
    <View style={styles.container}>
      <LottieView
        style={styles.lottiePie}
        source={require('../assets/lottie/pieChart.json')}
        autoPlay
      />
      <Text style={styles.textStyling}>
        Select some activities to see your data!
      </Text>
    </View>
  ) : (
    <View style={styles.container}>

      <VictoryPie
        animate
        width={350}
        theme={VictoryTheme.material}
        data={pie}
        labels = {({datum}) => datum.activity}

        // labelComponent={<VictoryTooltip />}
        // renderInPortal={true}

        events={[
          {
            target: 'data',
            eventHandlers: {
              onPressIn: () => {
                return [
                  {
                    target: 'data',
                    mutation: ({ style }) => {
                      return style.fill === '#ff0dbf'
                        ? null
                        : { style: { fill: '#ff0dbf' } };
                    },
                  },
                  {
                    target: 'labels',

                    // mutation: ({ text }) => {
                    //   console.log('text', text)
                    //   console.log(pie)
                    //   return text === 'clicked' ? null : { text: 'clicked' };
                    // mutation: (evt) => alert((`${evt.x}, ${evt.y}`))
                    mutation: (evt) => {

                        console.log('evt', evt.datum.frequency)

                      return [
                        {

                          eventKey: "all",
                          mutation: (props) => {
                            console.log('props', props)
                            return props.index === frequency ? null: {style: {fill: "orange"}}
                          }
                        }
                      ]
                    }
                    },
                  // },

                ];
              },
            },
          },
        ]}

        // labelPosition={({ index }) => index
        // ? "centroid"
        // : "startAngle"}
        // style={{
        //   labels: {
        //     fontSize: 24,
        //     // position: "fixed"
        //     //align: "center",
        //   },
        // }}
        //innerRadius={35}
        colorScale={[
          '#FFB319',
          '#FFE194',
          '#CAB8F8',
          '#97BFB4',
          '#B8DFD8',
          '#B5DEFF',
          '#ca6702',
          '#D0E562',
          'pink',
          'tomato',
        ]}
        //x="activity"
        y="frequency"
      />

    </View>
  );
};
export default ActivityTracker;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    //paddingBottom: 30,
    fontSize: 20,
  },
  textStyling: {
    display: 'flex',
    color: '#b5179e',
    alignContent: 'center',
    textAlign: 'center',
    fontFamily: 'Avenir',
    //fontSize: 16
  },
  lottiePie: {
    width: 150,
    height: 150,
  },
});
