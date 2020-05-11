/*global google*/

import React, { Component } from "react";
import { connect } from "react-redux";
import {
  incrementAsync,
  decrementAsync,
  asyncDumpUsersToConsole,
  asyncAddFollowerToCurrentUser
} from "./testActions";
import { Button, Header } from "semantic-ui-react";
import TestPlaceInput from "./TestPlaceInput";
import SimpleMap from "./SimpleMap";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import { openModal } from "../../modals/modalActions";
import firebase from "../../app/config/firebase";
import { toastr } from "react-redux-toastr";

const mapState = state => ({
  data: state.rdrTest.data,
  loading: state.async.loading,
  buttonName: state.async.elementName
});

const actions = {
  incrementAsync,
  decrementAsync,
  asyncDumpUsersToConsole,
  asyncAddFollowerToCurrentUser,
  openModal
};

class TestComponent extends Component {
  state = {
    cityLatLng: { lat: 59.95, lng: 30.33 },
    zoom: 11
  };

  handleCitySelect = selectedCity => {
    geocodeByAddress(selectedCity)
      .then(results => getLatLng(results[0]))
      .then(latlng => {
        this.setState({
          cityLatLng: latlng
        });
      });
    // .then(() => {
    //   this.props.change("city", selectedCity);
    // });
  };

  handleTestUpdateProfile = async () => {
    const firestore = firebase.firestore();
    // doc = mary's userUid
    let userDocRef = await firestore
      .collection("users")
      .doc("91oSxzrTcddgsVPC0qlBFdpi3wQ2"); // Mary
    // .doc('lZC07CFaKwXT3gwHte7N4j7y82Z2')  // Bruce
    try {
      await userDocRef.update({ displayName: "testing" });
      toastr.success("Success");
    } catch (error) {
      console.log(error);
      toastr.error("Computer says no");
    }
  };

  handleCreateTestEvent = async () => {
    const firestore = firebase.firestore();
    let eventDocRef = await firestore.collection("events").doc("DELETEME");
    try {
      await eventDocRef.set({
        title: "DELETEME"
      });
      toastr.success("Success");
    } catch (error) {
      console.log(error);
      toastr.error("Computer says no");
    }
  };

  handleTestJoinEvent = async () => {
    const firestore = firebase.firestore();
    let eventDocRef = await firestore.collection("events").doc("DELETEME");
    const attendee = {
      photoURL: "/assets/user.png",
      displayName: "Testing"
    };
    try {
      await eventDocRef.update({
        [`attendees.91oSxzrTcddgsVPC0qlBFdpi3wQ2`]: attendee
      });
      toastr.success("Success");
    } catch (error) {
      console.log(error);
      toastr.error("Computer says no");
    }
  };

  handleTestCancelGoingToEvent = async () => {
    const firestore = firebase.firestore();
    let eventDocRef = await firestore.collection("events").doc("DELETEME");
    try {
      await eventDocRef.update({
        [`attendees.91oSxzrTcddgsVPC0qlBFdpi3wQ2`]: firebase.firestore.FieldValue.delete()
      });
      toastr.success("Success");
    } catch (error) {
      console.log(error);
      toastr.error("Computer says no");
    }
  };

  handleTestChangeAttendeePhotoInEvent = async () => {
    const firestore = firebase.firestore();
    let eventDocRef = await firestore.collection("events").doc("DELETEME");
    try {
      await eventDocRef.update({
        [`attendees.91oSxzrTcddgsVPC0qlBFdpi3wQ2.photoURL`]: "testing123.jpg"
      });
      toastr.success("Success");
    } catch (error) {
      console.log(error);
      toastr.error("Computer says no");
    }
  };

  render() {
    const {
      data,
      incrementAsync,
      decrementAsync,
      asyncDumpUsersToConsole,
      asyncAddFollowerToCurrentUser,
      openModal,
      loading,
      buttonName
    } = this.props;

    return (
      <div>
        <h1>Test Component</h1>
        <h3>The answer is: {data}</h3>
        <Button
          name='increment'
          loading={buttonName === "increment" && loading}
          onClick={e => incrementAsync(e.target.name)}
          positive
          content='Increment'
        />
        <Button
          name='decrement'
          loading={buttonName === "decrement" && loading}
          onClick={e => decrementAsync(e.target.name)}
          negative
          content='Decrement'
        />
        <Button
          onClick={() => openModal("TestModal", { data: 42 })}
          color='teal'
          content='Open Modal'
        />
        <Button
          name='dumpUsers'
          loading={buttonName === "dumpUsers" && loading}
          onClick={e => asyncDumpUsersToConsole(e.target.name)}
          color='teal'
          content='Dump Users'
        />
        <Button
          name='addFollowerToCurrentUser'
          loading={buttonName === "addFollowerToCurrentUser" && loading}
          onClick={e => asyncAddFollowerToCurrentUser(e.target.name)}
          color='teal'
          content='Add Follower To Current User'
        />

        <br />
        <br />
        <br />
        <br />
        <Header as='h2' content='Permissions tests' />
        <Button
          onClick={this.handleCreateTestEvent}
          color='blue'
          fluid
          content='Test create event - should fail if anon'
        />
        <Button
          onClick={this.handleTestUpdateProfile}
          color='orange'
          fluid
          content='Test update marys profile - should fail if anon/not mary - should succeed if mary'
        />
        <Button
          onClick={this.handleTestJoinEvent}
          color='olive'
          fluid
          content='Test joining an event - should fail if anon/not mary - should succeed if mary'
        />
        <Button
          onClick={this.handleTestCancelGoingToEvent}
          color='purple'
          fluid
          content='Test cancelling attendance to an event - should fail if anon/not mary - should succeed if mary'
        />
        <Button
          onClick={this.handleTestChangeAttendeePhotoInEvent}
          color='violet'
          fluid
          content='Test changing photo for event attendee - should fail if anon/not mary - should succeed if mary'
        />
        <br />
        <br />

        <TestPlaceInput
          options={{ types: ["(cities)"] }}
          selectAddress={this.handleCitySelect}
        />
        <SimpleMap
          key={this.state.cityLatLng.lng}
          cityLatLng={this.state.cityLatLng}
          zoom={this.state.zoom}
          options={{
            location: new google.maps.LatLng(this.state.cityLatLng)
            // radius: 1000,
            // types: ["establishment"]
          }}
        />
      </div>
    );
  }
}

export default connect(mapState, actions)(TestComponent);
