import React from "react";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import { compose } from "redux";
import { Grid, Segment, Header, Card, Label } from "semantic-ui-react";
import PersonCard from "./PersonCard";

const query = ({ auth }) => {
  return [
    {
      collection: "users",
      doc: auth.uid,
      subcollections: [{ collection: "following" }],
      storeAs: "following"
    },
    {
      collection: "users",
      doc: auth.uid,
      subcollections: [{ collection: "followers" }],
      storeAs: "followers"
    }
  ];
};

const mapState = state => ({
  auth: state.firebase.auth,
  profile: state.firebase.profile,
  following: state.firestore.ordered.following,
  followers: state.firestore.ordered.followers,
  loading: state.async.loading
});

const PeopleDashboard = ({ auth, user, photos, following, followers }) => {
  console.log("user: ", user);
  console.log("following: ", following);
  console.log("followers: ", followers);
  console.log("auth: ", auth);

  return (
    <Grid>
      <Grid.Column width={16}>
        <Segment>
          <Header dividing content='People following me' />
          {user}
          <Card.Group itemsPerRow={8} stackable>
            {followers &&
              followers.length > 0 &&
              followers.map(f => <PersonCard key={f.id} person={f} />)}
            {followers && followers.length === 0 && (
              <Label content='No Followers' size='large' />
            )}
          </Card.Group>
        </Segment>
        <Segment>
          <Header dividing content="People I'm following" />
          <Card.Group itemsPerRow={8} stackable>
            {following &&
              following.length > 0 &&
              following.map(f => <PersonCard key={f.id} person={f} />)}
            {following && following.length === 0 && (
              <Label content='Not Following Anyone' size='large' />
            )}
          </Card.Group>
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default compose(
  connect(mapState, null),
  firestoreConnect(auth => query(auth))
)(PeopleDashboard);
