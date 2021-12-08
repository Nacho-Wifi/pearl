import React, { useState } from "react";
import { Alert, Modal, StyleSheet, Text, Pressable, View, TouchableOpacity, Image } from "react-native";

const About = () => {
  const [modalVisible, setModalVisible] = useState(false);
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTextHeader}>About Pearl</Text>
            <Text style={styles.modalText}>
              Have you ever wanted to start journaling but found it too hard to make it into a habit?
              With Pearl, all you have to do is select your daily activity and moods, as well as a
              text entry and photo for the day if you'd like!
            </Text>
            <Text style={styles.modalText}>
              "My Data" displays your activity and moods over time, giving you the opportunity to
              identify what activities may correlate with specific moods.
            </Text>
            <Text style={styles.modalText}>
              "My Journals" has a calendar that lets you see your activity and moods on a specific date.
            </Text>
            <Text style={styles.modalText}>
              "Resources" shows you parks, therapists, and meditation centers near you.
            </Text>
            <TouchableOpacity
              style={[styles.button, styles.buttonOpen]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Image source={require('../assets/icons/back-button.png')}
                style={{
                  tintColor: 'white',
                  position: 'absolute',
                  alignSelf: 'center',
                  height: 24,
                  width: 24,
                }} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <TouchableOpacity
        style={[styles.button, styles.buttonOpen]}
        onPress={() => setModalVisible(true)}
      >
        <Image source={require('../assets/icons/info.png')}
          style={{
            tintColor: 'white',
            position: 'absolute',
            alignSelf: 'center',
            height: 24,
            width: 24,
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    // margin: 20,
    width: '75%',
    backgroundColor: "white",
    borderRadius: 10,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  button: {
    borderRadius: 10,
    padding: 10,
    // elevation: 2 // idk what this does
  },
  buttonOpen: {
    backgroundColor: "#FBD1B7",
    borderRadius: 100,
    padding: 12,
  },
  buttonClose: {
    backgroundColor: "#FBD1B7",
    borderRadius: 100,
    paddingHorizontal: 16,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    fontSize: 12,
    marginBottom: 15,
    textAlign: "center"
  },
  modalTextHeader: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center"
  },
  input: {
    color: "black",
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default About;