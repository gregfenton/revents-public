import {
  INCREMENT_COUNTER,
  DECREMENT_COUNTER,
  DUMP_USERS_TO_CONSOLE,
  ADD_FOLLOWER_TO_CURRENT_USER
} from "./testConstants";
import { asyncActionFinish } from "../async/asyncActions";
import { ASYNC_ACTION_START } from "../async/asyncConstants";
import firebase from "../../app/config/firebase";

export const incrementCounter = () => {
  return {
    type: INCREMENT_COUNTER
  };
};

export const decrementCounter = () => {
  return {
    type: DECREMENT_COUNTER
  };
};

export const dumpUsersToConsole = async () => {

  const firestore = firebase.firestore();
  var usersRef = firestore.collection("users");
  let querySnap = await usersRef.get();

  let users = [];

  console.log(querySnap);

  try {
    for (let i = 0; i < querySnap.docs.length; i++) {
      let u = {
        ...querySnap.docs[i].data(),
        id: querySnap.docs[i].id     // this clobbers an "id" field if it already exists
      };
      console.log("u: ", u);
      users.push(u);
    }
  } catch (error) {
    console.log(error);
  }

  console.log({ users });

  return {
    type: DUMP_USERS_TO_CONSOLE
  };
};

export const addFollowerToCurrentUser = async () => {
  const user = firebase.auth().currentUser;

  const followRecord = {
    followDate: new Date(),
    photoURL:
      "https://firebasestorage.googleapis.com/v0/b/revents-udemy-exercise.appspot.com/o/lZC07CFaKwXT3gwHte7N4j7y82Z2%2Fuser_images%2Fck7cc9cou00023h5yqcf6am5k?alt=media&token=ff69269f-1def-4e6f-bb50-19a2f177b38b",
    displayName: "MaryContrary",
    city: "Paris, France"
  };

  try {
    // console.log("attendee: ", attendee);

    firebase
      .firestore()
      .collection("users")
      .doc(user.uid)
      .collection("following")
      .add(followRecord)
      .then(console.log("added the followRecord"));
  } catch (error) {
    console.log(error);
  }

  return {
    type: ADD_FOLLOWER_TO_CURRENT_USER
  };
};


const delay = ms => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const asyncDumpUsersToConsole = name => {
  return async dispatch => {
    dispatch({ type: ASYNC_ACTION_START, payload: name });
    dumpUsersToConsole();
    dispatch(asyncActionFinish());
  };
};
export const asyncAddFollowerToCurrentUser = name => {
  return async dispatch => {
    dispatch({ type: ASYNC_ACTION_START, payload: name });
    addFollowerToCurrentUser();
    dispatch(asyncActionFinish());
  };
};
export const incrementAsync = name => {
  return async dispatch => {
    dispatch({ type: ASYNC_ACTION_START, payload: name });
    await delay(1000);
    dispatch(incrementCounter());
    dispatch(asyncActionFinish());
  };
};

export const decrementAsync = name => {
  return async dispatch => {
    dispatch({ type: ASYNC_ACTION_START, payload: name });
    await delay(1000);
    dispatch({ type: DECREMENT_COUNTER }); // just proving that we can call this directly rather than thru decrementCounter()
    dispatch(asyncActionFinish());
  };
};
