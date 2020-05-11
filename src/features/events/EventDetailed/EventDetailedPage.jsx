import React from "react";
import { Component } from "react";
import { connect } from "react-redux";
import { Grid, GridColumn } from "semantic-ui-react";
import EventDetailedHeader from "./EventDetailedHeader";
import EventDetailedInfo from "./EventDetailedInfo";
import EventDetailedChat from "./EventDetailedChat";
import EventDetailedSidebar from "./EventDetailedSidebar";
import { withFirestore, firebaseConnect } from "react-redux-firebase";
import { compose } from "redux";
import {
  objectToArray,
  createDataTree
} from "../../../app/common/util/helpers";
import { goingToEvent, cancelGoingToEvent } from "../../user/userActions";
import { addEventComment } from "../eventActions";
import { isEmpty } from "react-redux-firebase";
import { openModal } from "../../../modals/modalActions";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import NotFound from "../../../app/layout/NotFound";

const mapState = (state, ownProps) => {
  const eventId = ownProps.match.params.id;

  let event = {}; // in case we browse to an invalid event/id - avoid errors

  if (
    state.firestore.ordered.events &&
    state.firestore.ordered.events.length > 0
  ) {
    event =
      state.firestore.ordered.events.filter(event => event.id === eventId)[0] ||
      {}; // ensure we don't return undef or null
  }

  return {
    event,
    auth: state.firebase.auth,
    loading: state.async.loading,
    requesting: state.firestore.status.requesting,
    eventChat:
      !isEmpty(state.firebase.data.event_chat) &&
      objectToArray(state.firebase.data.event_chat[ownProps.match.params.id])
  };
};

const actions = {
  goingToEvent,
  cancelGoingToEvent,
  addEventComment,
  openModal
};

class EventDetailedPage extends Component {
  async componentDidMount() {
    const { firestore, match } = this.props;

    await firestore.setListener(`events/${match.params.id}`);
  }

  async componentWillMount() {
    const { firestore, match } = this.props;

    await firestore.unsetListener(`events/${match.params.id}`);
  }

  render() {
    const {
      event,
      auth,
      goingToEvent,
      cancelGoingToEvent,
      addEventComment,
      loading,
      eventChat,
      openModal,
      requesting,
      match
    } = this.props;
    const attendees =
      event &&
      event.attendees &&
      objectToArray(event.attendees).sort((a, b) => {
        return a.joinDate.toDate() - b.joinDate.toDate(); // host will always have joined first
      });

    const isHost = event.hostUid === auth.uid;
    const isGoing = attendees && attendees.some(a => a.id === auth.uid);
    const chatTree = !isEmpty(eventChat) && createDataTree(eventChat);
    const isAuthenticated = auth.isLoaded && !auth.isEmpty;
    const loadingEvent = requesting[`events/${match.params.id}`];

    if (loadingEvent) return <LoadingComponent />;

    if (Object.keys(event).length === 0) return <NotFound />; // no such record found

    return (
      <Grid>
        <GridColumn width={10}>
          <EventDetailedHeader
            event={event}
            isGoing={isGoing}
            isHost={isHost}
            goingToEvent={goingToEvent}
            loading={loading}
            cancelGoingToEvent={cancelGoingToEvent}
            isAuthenticated={isAuthenticated}
            openModal={openModal}
          />
          <EventDetailedInfo event={event} />
          {isAuthenticated && (
            <EventDetailedChat
              addEventComment={addEventComment}
              eventId={event.id}
              eventChat={chatTree}
            />
          )}
        </GridColumn>
        <GridColumn width={6}>
          <EventDetailedSidebar attendees={attendees} />
        </GridColumn>
      </Grid>
    );
  }
}

export default compose(
  withFirestore,
  connect(mapState, actions),
  firebaseConnect(props => [`event_chat/${props.match.params.id}`])
)(EventDetailedPage);
