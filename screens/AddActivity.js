import React, { useState } from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import { auth, db } from '../firebase';
import { addDoc, collection } from 'firebase/firestore';
import EmojiSelector from 'react-native-emoji-selector';

const AddActivity = ({ setModalVisible, modalVisible }) => {
  const [text, setText] = useState('');
  const [icon, setIcon] = useState('');
  // const [number, onChangeNumber] = React.useState(null);

  const activitiesCollectionRef = collection(db, 'Activities');

  const handleAddActivity = async (activityName) => {
    await addDoc(activitiesCollectionRef, {
      activityName,
      imageUrl: '🏄',
      userId: auth.currentUser.email,
    });
  };
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.cancelContainer}>
              <TouchableOpacity onPress={() => setModalVisible(!modalVisible)}>
                <Image source={require('../assets/icons/cancel.png')} />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalText}>Add Activity</Text>
            <TextInput
              style={{
                height: 40,
                width: '100%',
                borderWidth: 1,
                borderColor: '#BDD8F1',
              }}
              placeholder="Activity Name"
              onChangeText={(text) => setText(text)}
              defaultValue={text}
            />

            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => handleAddActivity(text)}
            >
              <Text style={styles.textStyle}>Add</Text>
            </Pressable>

            {!!icon && (
              <Text style={styles.icontextStyle}>
                Your selected Icon is : {icon}
              </Text>
            )}

            <EmojiSelector
              style={styles.emojiBoard}
              onEmojiSelected={(emoji) => setIcon(emoji)}
              showTabs={false}
            />
          </View>
        </View>
      </Modal>
      <Pressable
        style={[styles.button, styles.buttonOpen]}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.textStyle}>+</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    backgroundColor: 'white',
  },
  modalView: {
    // margin: 20,
    width: '80%',
    height: '80%',
    // backgroundColor: 'white',
    // borderRadius: 10,
    // padding: 35,
    // alignItems: 'center',
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 2,
    // },
    // shadowOpacity: 0.25,
    // shadowRadius: 4,
    // elevation: 5,
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
    borderRadius: 10,
    padding: 10,
    // elevation: 2 // idk what this does
  },
  buttonOpen: {
    backgroundColor: '#BDD8F1',
    borderRadius: 100,
    paddingHorizontal: 14,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
    margin: 8,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  icontextStyle: {
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    color: 'black',
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  emojiBoard: {
    width: '80%',
    height: '45%',
    position: 'relative',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelContainer: {
    position: 'absolute',
    alignSelf: 'flex-end',
    padding: 10,
  },
});

export default AddActivity;
