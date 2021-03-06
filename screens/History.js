import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import ModalHistory from './ModalHistory';
import { auth, db } from '../firebase';
import { getDocs, query, where, collection } from 'firebase/firestore';
import LottieView from 'lottie-react-native';

const History = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [entry, setEntry] = useState({});
  const journalEntriesCollectionRef = collection(db, 'Journals');
  //get time of userCreation to set mininum for Calendar
  const userCreation = auth.currentUser.metadata.creationTime;
  const handleClick = async (daySelected) => {
    const userId = auth.currentUser.email;
    const entryQuery = query(
      journalEntriesCollectionRef,
      where('userId', '==', userId),
      where('createdAt', '==', daySelected)
    );
    const querySnapshot = await getDocs(entryQuery);
    //if querySnapshot size is 0, there was not an entry for that day and
    //we setEntry to an empty object
    if (querySnapshot.size > 0) {
      querySnapshot.forEach((doc) => {
        //setEntry as the doc we get back from Journal for that day
        //will pass down to ModalHistory as props to display
        setEntry(doc.data());
      });
    } else {
      setEntry({});
    }

    setModalVisible(true);
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: 'center',
      }}
    >
      <LottieView
        style={styles.lottieMountain}
        source={require('../assets/lottie/mountain-night.json')}
        autoPlay
      />
      <Calendar
        style={{ borderRadius: 10, borderWidth: 3, borderColor: 'gray' }}
        onDayPress={(day) => {
          //we have access to the datestring aka yyyy-mm-dd.
          //to show the correct date when using toDateString(), we must change the format
          //from yyyy-mm-dd to yyyy/mm/dd
          handleClick(
            new Date(day.dateString.replace(/-/g, '/')).toDateString()
          );
        }}
        // Do not show days of other months in month page. Default = false
        hideExtraDays={true}
        minDate={new Date(userCreation).toDateString()}
        maxDate={new Date()}
        // Handler which gets executed when press arrow icon left. It receive a callback can go back month
        onPressArrowLeft={(subtractMonth) => subtractMonth()}
        // Handler which gets executed when press arrow icon right. It receive a callback can go next month
        onPressArrowRight={(addMonth) => addMonth()}
      />
      {modalVisible && (
        <ModalHistory
          setModalVisible={setModalVisible}
          modalVisible={modalVisible}
          entry={entry}
        />
      )}
    </SafeAreaView>
  );
};

export default History;

const styles = StyleSheet.create({
  lottieMountain: {
    width: 470,
    height: 920,
    position: 'absolute',
  },
});
