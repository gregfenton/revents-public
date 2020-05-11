import { toastr } from "react-redux-toastr";
import { createNewEvent } from "../../app/common/util/helpers";
import firebase from "../../app/config/firebase";
import { FETCH_EVENTS } from "./eventConstants";
import {
  asyncActionStart,
  asyncActionError,
  asyncActionFinish
} from "../async/asyncActions";

export const createEvent = event => {
  return async (dispatch, getState, { getFirebase, getFirestore }) => {
    const firebase = getFirebase();
    const firestore = getFirestore();
    const user = firebase.auth().currentUser;
    const photoURL = getState().firebase.profile.photoURL;
    const newEvent = createNewEvent(user, photoURL, event);

    try {
      dispatch(asyncActionStart());
      let createdEvent = await firestore.add("events", newEvent);
      await firestore.set(`event_attendee/${createdEvent.id}_${user.uid}`, {
        eventId: createdEvent.id,
        userUid: user.uid,
        eventDate: event.date,
        host: true
      });
      toastr.success("Success!", "Event has been created");
      dispatch(asyncActionFinish());
      return createdEvent;
    } catch (error) {
      console.log("err1: ", error);
      toastr.error("Oops!", "Something went wrong");
      dispatch(asyncActionError());
    }
  };
};

export const updateEvent = event => {
  return async (dispatch, getState) => {
    const firestore = firebase.firestore();

    try {
      dispatch(asyncActionStart());
      let eventDocRef = firestore.collection("events").doc(event.id);
      let dateEqual = getState().firestore.ordered.events[0].date.isEqual(
        event.date
      ); // check if Event's date has been changed

      if (!dateEqual) {
        let batch = firestore.batch();
        batch.update(eventDocRef, event);

        // update event_attendee records with modified event date
        //
        let eventAttendeeRef = firestore.collection("event_attendee");
        let eventAttendeeQuery = await eventAttendeeRef.where(
          "eventId",
          "==",
          event.id
        );
        let eventAttendeeQuerySnap = await eventAttendeeQuery.get();
        for (let i = 0; i < eventAttendeeQuerySnap.docs.length; i++) {
          let eventAttendeeDocRef = await firestore
            .collection("event_attendee")
            .doc(eventAttendeeQuerySnap.docs[i].id);

          batch.update(eventAttendeeDocRef, {
            eventDate: event.date
          });
        }
        await batch.commit();
      } else {
        await eventDocRef.update(event); // date not changed, so update the event as normal
      }

      dispatch(asyncActionFinish());
      toastr.success("Success!", "Event has been updated");
    } catch (error) {
      dispatch(asyncActionError());
      console.log("err2: ", error);
      toastr.error("Oops!", "Something went wrong");
    }
  };
};

export const cancelToggle = (cancelled, eventId) => async (
  dispatch,
  getState,
  { getFirestore }
) => {
  const firestore = getFirestore();
  const message = cancelled
    ? "Are you sure you want to cancel the event?"
    : "This will reactivate the event.  Are you sure?";

  try {
    toastr.confirm(message, {
      onOk: async () =>
        await firestore.update(`events/${eventId}`, {
          cancelled: cancelled
        })
    });
  } catch (error) {
    console.log(error);
  }
};

export const getEventsForDashboard = lastFetchedEvent => async (
  dispatch,
  getState
) => {
  const firestore = firebase.firestore();
  const eventsRef = firestore.collection("events");

  try {
    dispatch(asyncActionStart());

    let startAfter =
      lastFetchedEvent &&
      (await firestore
        .collection("events")
        .doc(lastFetchedEvent.id)
        .get());

    let query;

    query = lastFetchedEvent
      ? eventsRef
          // .where("date", ">=", today)
          .orderBy("date")
          .startAfter(startAfter)
          .limit(2)
      : eventsRef
          // .where("date", ">=", today)
          .orderBy("date")
          .limit(2);

    let querySnap = await query.get(); // go get 'em!

    if (querySnap.docs.length === 0) {
      // no more docs to show
      dispatch(asyncActionFinish());
      return querySnap;
    }

    let events = [];
    for (let i = 0; i < querySnap.docs.length; i++) {
      let evt = {
        ...querySnap.docs[i].data(),
        id: querySnap.docs[i].id
      };
      events.push(evt);
    }
    // console.log(events);
    dispatch({ type: FETCH_EVENTS, payload: { events } });
    dispatch(asyncActionFinish());

    return querySnap;
  } catch (error) {
    console.log(error);
    dispatch(asyncActionError());
  }
};

export const addEventComment = (eventId, values, parentId) => async (
  dispatch,
  getState,
  { getFirebase }
) => {
  const firebase = getFirebase();
  const profile = getState().firebase.profile;
  const user = firebase.auth().currentUser;
  let newComment = {
    parentId: parentId,
    displayName: profile.displayName,
    photoURL: profile.photoURL || "/assets/user.png",
    uid: user.uid,
    text: values.comment,
    date: Date.now()
  };

  try {
    await firebase.push(`event_chat/${eventId}`, newComment);
  } catch (error) {
    console.log("err3: ", error);
    toastr.error("Oops", "Problem adding comment");
  }
};
