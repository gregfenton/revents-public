import React from "react";
import { Segment, Header, Card, Image, Tab } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

const panes = [
  { menuItem: "All Events", pane: { key: "allEvents" } },
  { menuItem: "Past Events", pane: { key: "pastEvents" } },
  { menuItem: "Future Events", pane: { key: "futureEvents" } },
  { menuItem: "Hosting", pane: { key: "hosted" } }
];

const UserDetailedEvents = ({ events, eventsLoading, changeTab }) => {
  return (
    <Segment attached loading={eventsLoading}>
      <Header icon='calendar' content='Events' />
      <Tab
        onTabChange={(e, tabData) => changeTab(e, tabData)}
        panes={panes}
        menu={{ secondary: true, pointing: true }}
      />
      <br />
      <Card.Group itemsPerRow={5}>
        {events &&
          events.length > 0 &&
          events.map(event => (
            <Card as={Link} to={`/events/${event.id}`} key={event.id}>
              <Image src={`/assets/categoryImages/${event.category}.jpg`} />
              <Card.Content>
                <Card.Header textAlign='center'>{event.title}</Card.Header>
                <Card.Meta textAlign='center'>
                  <div>
                    {format(event.date && event.date.toDate(), "LLL dd, yyyy")}{" "}
                    at{" "}
                  </div>
                  <div>
                    {format(event.date && event.date.toDate(), "h:mm a")}
                  </div>
                </Card.Meta>
              </Card.Content>
            </Card>
          ))}
        {events && events.length === 0 && (
          <Card>
            <Card.Content>
              <Card.Header textAlign='center'>No events</Card.Header>
            </Card.Content>
          </Card>
        )}
      </Card.Group>
    </Segment>
  );
};

export default UserDetailedEvents;
