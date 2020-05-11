const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

const newActivity = (type, event, id) => {
  return {
    type: type,
    eventDate: event.date,
    hostedBy: event.hostedBy,
    title: event.title,
    photoURL: event.hostPhotoURL,
    timestamp: admin.firestore.FieldValue.serverTimestamp(),
    hostUid: event.hostUid,
    eventId: id
  };
};

exports.createActivity = functions.firestore
  .document("events/{eventId}")
  .onCreate(event => {
    let newEvent = event.data();

    console.log("newEvent: ", newEvent);

    const activity = newActivity("newEvent", newEvent, event.id);

    console.log("activity: ", activity);

    return admin
      .firestore()
      .collection("activity")
      .add(activity)
      .then(docRef => {
        return console.log("Activity created with ID: ", docRef.id);
      })
      .catch(err => {
        return console.log("Error adding activity", err);
      });
  });

exports.cancelActivity = functions.firestore
  .document("events/{eventId}")
  .onUpdate((event, context) => {
    let updatedEvent = event.after.data();
    let previousEventData = event.before.data();
    console.log("event: ", { event });
    console.log("context: ", { context });
    console.log("updatedEvent: ", { updatedEvent });
    console.log("previousEventData: ", { previousEventData });

    if (
      !updatedEvent.cancelled ||
      updatedEvent.cancelled === previousEventData.cancelled
    ) {
      return false;
    }

    const activity = newActivity(
      "cancelledEvent",
      updatedEvent,
      context.params.eventId
    );

    console.log("activity: ", { activity });

    return admin
      .firestore()
      .collection("activity")
      .add(activity)
      .then(docRef => {
        return console.log("Activity created with ID: ", docRef.id);
      })
      .catch(err => {
        return console.log("Error adding activity", err);
      });
  });

exports.updateActivityPhotos = functions.firestore
  .document("users/{userId}")
  .onUpdate((user, context) => {
    let updatedUserData = user.after.data();
    let previousUserData = user.before.data();
    let userId = context.params.userId;

    console.log("user: ", { user });
    console.log("context: ", { context });
    console.log("updatedUserData: ", { updatedUserData });
    console.log("previousUserData: ", { previousUserData });
    console.log("userId: ", userId);

    if (updatedUserData.photoURL === previousUserData.photoURL) {
      console.log("no photo change made");
      return false;
    }

    let query = admin
      .firestore()
      .collection("activity")
      .where("hostUid", "==", userId);

    return query
      .orderBy("eventDate", "desc")
      .limit(500)
      .get()
      .then(querySnap => {
        let docs = querySnap.docs;
        for (let doc of docs) {
          console.log("doc: ", doc);
          admin
            .firestore()
            .collection("activity")
            .doc(doc.id)
            .update({ photoURL: updatedUserData.photoURL });
        }
        return console.log(`handled ${querySnap.docs.length} changes`);
      })
      .catch(error => {
        console.log("error: ", error);
      });
  });

exports.userFollowing = functions.firestore
  .document("users/{followerUid}/following/{followingUid}")
  .onCreate((event, context) => {
    console.log("version: March 8, 2020 20:29:22 EDT");
    const followerUid = context.params.followerUid;
    const followingUid = context.params.followingUid;

    const followerDoc = admin
      .firestore()
      .collection("users")
      .doc(followerUid);

    console.log(followerDoc);

    return followerDoc.get().then(doc => {
      let userData = doc.data();
      console.log({ userData });
      let follower = {
        displayName: userData.displayName,
        photoURL: userData.photoURL || "/assets/user.png",
        city: userData.city || "TBN"
      };
      return admin
        .firestore()
        .collection("users")
        .doc(followingUid)
        .collection("followers")
        .doc(followerUid)
        .set(follower);
    });
  });

exports.unfollowUser = functions.firestore
  .document("users/{followerUid}/following/{followingUid}")
  .onDelete((event, context) => {
    console.log("version: March 8, 2020 20:29:02 EDT");
    return admin
      .firestore()
      .collection("users")
      .doc(context.params.followingUid)
      .collection("followers")
      .doc(context.params.followerUid)
      .delete()
      .then(() => {
        return console.log("follower doc deleted");
      })
      .catch(err => {
        return console.log("Error deleting follower doc: ", err);
      })
  });
