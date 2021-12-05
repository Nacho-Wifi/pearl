import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Pressable,
  Image,
  SafeAreaView,
} from 'react-native';

const ModalHistory = ({ setModalVisible, modalVisible, entry }) => {
  const emojiMapping = {
    'U+1F622': '😢',
    'U+1F614': '😔',
    'U+1F610': '😐',
    'U+1F60C': '😌',
    'U+1F601': '😁',
  };
  const activitiesEmojiMapping = {
    'U+1F6C0': '🛀',
    'U+1F3A8': '🎨',
    'U+1F4D6': '📖',
    'U+1F9D8': '🧘',
    'U+1F6B6': '🚶',
    'U+1F3A7': '🎧',
    'U+1F372': '🍲',
    'U+1F465': '👥',
    'U+1F6B2': '🚲',
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
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View>
                <Text>Sorry, you didn't have an Entry for this day</Text>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text style={styles.textStyle}>Hide Modal</Text>
                </Pressable>
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
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View>
              {/* Mood */}
              <Text style={styles.modalText}>Mood:</Text>
              <Text style={styles.modalText}>
                {emojiMapping[entry.mood.imageUrl]}
              </Text>
              {/* Activities */}
              <Text style={styles.modalText}>Activities:</Text>
              {entry.activities.map((activity) => {
                return (
                  <Text key={activity.id} style={styles.modalText}>
                    {activity.activityName}{' '}
                    {activitiesEmojiMapping[activity.emojiUnicode]}
                  </Text>
                );
              })}
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
                <View style={styles.textContainer}>
                  <Text style={styles.modalText}>{entry.textInput}</Text>
                </View>
              )}

              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>Hide Modal</Text>
              </Pressable>
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
    // alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
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
    // textAlign: 'center',
  },
  displayImage: {
    width: 200,
    height: 200,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  // textContainer: {
  //   flex: 1,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
});
