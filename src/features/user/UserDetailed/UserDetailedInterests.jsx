import React from "react";
import { Segment, Item, Header, Icon, List } from "semantic-ui-react";
import { isEmpty } from "react-redux-firebase";

const UserDetailedInterests = ({ profile }) => {
  let interests = {};
  if (profile) {
    interests = profile.interests;
  }

  return (
    <Segment>
      <Header icon='heart outline' content='Interests' />
      <List>
        {!isEmpty(interests) &&
          interests.map(i => (
            <Item key={i}>
              <Icon name='heart' />
              <Item.Content>{i}</Item.Content>
            </Item>
          ))}
          {!interests && 'No interests'}
      </List>
    </Segment>
  );
};

export default UserDetailedInterests;
