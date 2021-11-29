import { auth, db } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, addDoc, getDoc, setDoc, collection } from 'firebase/firestore';
//action types
const SET_USER = 'SET_USER';

//action creators
const setUser = (user) => ({
  type: SET_USER,
  user,
});

//thunks
export const loginUser = (email, password) => {
  return (dispatch) => {
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const userEmail = userCredential.user.email;
        const userCollectionRef = doc(db, 'Users', userEmail);
        const userObject = await getDoc(userCollectionRef);
        if (userObject.exists()) {
          const user = userObject.data();
          dispatch(setUser(user));
        } else {
          console.error('No user found');
        }
      })
      .catch((error) => alert(error.message));
  };
};

export const signupUser = (email, password, firstName, lastName) => {
  return (dispatch) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        console.log('Registered: ', user.email);
        const data = {
          email: user.email,
          firstName,
          lastName,
        };
        await setDoc(doc(db, 'Users', user.email), data);
        const userEmail = userCredential.user.email;
        const userCollectionRef = doc(db, 'Users', userEmail);
        const userObject = await getDoc(userCollectionRef);
        if (userObject.exists()) {
          const user = userObject.data();
          dispatch(setUser(user));
        } else {
          console.error('No user found');
        }
      })
      .catch((error) => alert(error.message));
  };
};
//reducer

const initialState = {
  currentUser: {},
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return { ...state, currentUser: action.user };
    default:
      return state;
  }
};
