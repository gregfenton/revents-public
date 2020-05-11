import React from "react";
import { differenceInYears } from "date-fns";
import { Segment, Item, Header } from "semantic-ui-react";
import LazyLoad from "react-lazyload";

const UserDetailedHeader = ({ profile }) => {
  let age;

  // calculate age outside of the return() to avoid errors on refresh
  //
  if (profile.dateOfBirth) {
    age = differenceInYears(Date.now(), profile.dateOfBirth.toDate());
  } else {
    age = "Unknown age";
  }

  return (
    <Segment>
      <Item.Group>
        <Item>
          <LazyLoad
            height={150}   // defer loading of images until the user scrolls the page below this viewport value
            //offset={-150}
            placehoder={<Item.Image avatar size='small' src='/assets/user.png' />}
          >
            <Item.Image
              avatar
              size='small'
              src={profile.photoURL || "/assets/user.png"}
            />
          </LazyLoad>

          <Item.Content verticalAlign='bottom'>
            <Header as='h1'>{profile.displayName}</Header>
            <br />
            <Header as='h3'>{profile.occupation}</Header>
            <br />
            <Header as='h3'>
              {age}, Lives in {profile.city ? profile.city : "unknown city"}
            </Header>
          </Item.Content>
        </Item>
      </Item.Group>
    </Segment>
  );
};

export default UserDetailedHeader;
