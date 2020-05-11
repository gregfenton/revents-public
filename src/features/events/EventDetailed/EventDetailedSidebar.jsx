import React, { Fragment } from "react";
import { Segment, Item, Label } from "semantic-ui-react";
import { Link } from "react-router-dom";

const calculateSidebarTitle = ({ attendees }) => {
  return attendees && attendees.length
    ? attendees.length +
        " " +
        (attendees && attendees.length === 1 ? "Person" : "People") +
        " Going"
    : "Nobody Signed Up Yet";
};

const EventDetailedSidebar = ({ attendees }) => {
  const title = calculateSidebarTitle({ attendees });

  return (
    <Fragment>
      <Segment
        textAlign='center'
        style={{ border: "none" }}
        attached='top'
        secondary
        inverted
        color='teal'
      >
        {title}
      </Segment>
      <Segment attached>
        <Item.Group relaxed divided>
          {attendees &&
            attendees.map(currAttendee => (
              <Item key={currAttendee.id} style={{ position: "relative" }}>
                {currAttendee.host && (
                  <Label
                    style={{ position: "absolute" }}
                    color='orange'
                    ribbon='right'
                  >
                    Host
                  </Label>
                )}
                <Item.Image size='mini' src={currAttendee.photoURL} />
                <Item.Content verticalAlign='middle'>
                  <Item.Header as='h3'>
                    <Link to={`/profile/${currAttendee.id}`}>
                      {currAttendee.displayName}
                    </Link>
                  </Item.Header>
                </Item.Content>
              </Item>
            ))}
        </Item.Group>
      </Segment>
    </Fragment>
  );
};

export default EventDetailedSidebar;
