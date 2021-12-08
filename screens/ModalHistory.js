import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import LottieView from 'lottie-react-native';

const ModalHistory = ({ setModalVisible, modalVisible, entry }) => {
  const emojiMapping = {
    'U+1F622': '😢',
    'U+1F614': '😔',
    'U+1F610': '😐',
    'U+1F60C': '😌',
    'U+1F601': '😁',
  };

  //if entry is empty for the day, render out appropriate modal
  if (Object.keys(entry).length === 0) {
    return (
      <SafeAreaView style={styles.modalContainer}>
        <Modal
          animationType="slide"
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}
        >
          <LottieView
            style={styles.lottieMountain}
            source={require('../assets/lottie/mountain.json')}
            autoPlay
          />
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.cancelContainer}>
                <TouchableOpacity
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Image source={require('../assets/icons/cancel.png')} />
                </TouchableOpacity>
              </View>
              <View style={styles.lottieContainer}>
                <LottieView
                  style={styles.noResult}
                  source={require('../assets/lottie/no-result.json')}
                  autoPlay
                />
                <Text style={styles.noJournalText}>
                  Sorry, you don't have a journal entry for this day
                </Text>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styles.modalContainer}>
      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}
      >
        <LottieView
          style={styles.lottieMountain}
          source={require('../assets/lottie/mountain.json')}
          autoPlay
        />
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.cancelContainer}>
              <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
                <Image source={require('../assets/icons/cancel.png')} />
              </TouchableOpacity>
            </View>
            <View>
              <View style={styles.modalHeaderMainContainer}>
                <Text style={styles.modalHeaderMain}>
                  Entry for {entry.createdAt}{' '}
                </Text>
              </View>
              {/* Photo */}
              {!!entry.photoURL && (
                <View style={styles.imageContainer}>
                  <Image
                    style={styles.displayImage}
                    source={{ uri: entry.photoURL }}
                  />
                </View>
              )}
              {/* Text Input */}
              {!!entry.textInput && (
                <View style={styles.imageContainer}>
                  <Text style={styles.modalText}>{entry.textInput}</Text>
                </View>
              )}
              {/* Mood */}
              <Text style={styles.modalHeader}>
                Mood: {emojiMapping[entry.mood.imageUrl]}
              </Text>
              {/* Activities */}
              <Text style={styles.modalHeaderActivities}>Activities</Text>
              {entry.activities.map((activity) => {
                return (
                  <Text key={activity.id} style={styles.modalActivities}>
                    {activity.activityName} {activity.image}
                  </Text>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ModalHistory;

const styles = StyleSheet.create({
  modalContainer: {
    position: 'absolute',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  lottieMountain: {
    width: 500,
    height: 900,
    position: 'absolute',
  },
  modalView: {
    margin: '2.5%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    // alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    fontSize: 18,
  },
  modalHeader: {
    marginBottom: 15,
    fontSize: 20,
  },
  modalHeaderActivities: {
    // marginBottom: 10,
    fontSize: 20,
    textDecorationLine: 'underline',
  },
  modalActivities: {
    position: 'relative',
    fontSize: 17,
  },
  modalHeaderMain: {
    padding: 15,
    fontSize: 20,
  },
  modalHeaderMainContainer: {
    borderColor: '#F9ECEC',
    borderWidth: 4,
    padding: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0.5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 15,
  },
  noJournalText: {
    display: 'flex',
    color: '#b5179e',
    alignContent: 'center',
    textAlign: 'center',
  },
  displayImage: {
    width: 200,
    height: 200,
    marginBottom: 5,
    borderRadius: 20,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  noResult: {
    width: 150,
    height: 150,
  },
  lottieContainer: {
    alignItems: 'center',
  },
  cancelContainer: {
    position: 'absolute',
    alignSelf: 'flex-end',
    padding: 10,
  },
});
