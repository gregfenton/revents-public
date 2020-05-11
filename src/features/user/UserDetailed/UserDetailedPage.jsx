import React, { Component } from "react";
import { Grid } from "semantic-ui-react";
import { connect } from "react-redux";
import UserDetailedHeader from "./UserDetailedHeader";
import UserDetailedAbout from "./UserDetailedAbout";
import UserDetailedPhotos from "./UserDetailedPhotos";
import UserDetailedEvents from "./UserDetailedEvents";
import { compose } from "redux";
import { firestoreConnect, isEmpty } from "react-redux-firebase";
import UserDetailedSidebar from "./UserDetailedSidebar";
import { userDetailedQuery } from "../userQueries";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { getUserEvents, followUser, unfollowUser } from "../userActions";

const mapState = (state, ownProps) => {
  let userUid = null;
  let profile = {};
  if (ownProps.match.params.id === state.auth.id) {   // the match comes from the router
    profile = state.firebase.profile;
  } else {
    profile =
      !isEmpty(state.firestore.ordered.profile) &&
      state.firestore.ordered.profile[0];
    userUid = ownProps.match.params.id;
  }

  return {
    profile,
    userUid,
    userEvents: state.events.theUserEvents,
    eventsLoading: state.async.loading,
    auth: state.firebase.auth,
    photos: state.firestore.ordered.photos,
    requesting: state.firestore.status.requesting,
    following: state.firestore.ordered.following
  };
};

const actions = {
  getUserEvents,
  followUser,
  unfollowUser
};

class UserDetailedPage extends Component {
  async componentDidMount() {
    await this.props.getUserEvents(this.props.userUid);
    // console.log(userEvents);
   }

  changeTab = (e, tabData) => {
    this.props.getUserEvents(this.props.userUid, tabData.activeIndex);
  };

  render() {
    const {
      profile,
      photos,
      auth,
      match,
      requesting,
      userEvents,
      eventsLoading,
      followUser,
      unfollowUser,
      following
    } = this.props;
    const isCurrentUser = auth.uid === match.params.id;
    const loading = Object.values(requesting).some(a => a === true);
    const isFollowing = !isEmpty(following);

    if (loading) return <LoadingComponent />;

    return (
      <Grid>
        <Grid.Column width={16}>
          <UserDetailedHeader profile={profile} />
        </Grid.Column>

        <Grid.Column width={12}>
          <UserDetailedAbout profile={profile} />
        </Grid.Column>

        <UserDetailedSidebar
          isCurrentUser={isCurrentUser}
          followUser={followUser}
          unfollowUser={unfollowUser}
          isFollowing={isFollowing}
          profile={profile}
        />

        {photos && photos.length > 0 && (
          <Grid.Column width={12}>
            <UserDetailedPhotos photos={photos} />
          </Grid.Column>
        )}

        <Grid.Column width={12}>
          <UserDetailedEvents
            events={userEvents}
            eventsLoading={eventsLoading}
            changeTab={this.changeTab}
          />
        </Grid.Column>
      </Grid>
    );
  }
}

export default compose(
  connect(mapState, actions),
  firestoreConnect((auth, userUid, match) =>
    userDetailedQuery(auth, userUid, match)
  )
)(UserDetailedPage);
