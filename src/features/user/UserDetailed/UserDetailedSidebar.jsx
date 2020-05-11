import React from "react";
import { Segment, Grid, Button } from "semantic-ui-react";
import { Link } from "react-router-dom";

const UserDetailedSidebar = ({
  isCurrentUser,
  followUser,
  unfollowUser,
  profile,
  isFollowing
}) => {
  return (
    <Grid.Column width={4}>
      <Segment>
        {/* use {Link} to send it through the correct Router */}
        {isCurrentUser ? (
          <Button
            as={Link}
            to='/settings'
            color='teal'
            fluid
            basic
            content='Edit Profile'
          />
        ) : isFollowing ? (
          <Button
            onClick={() => unfollowUser(profile)}
            color='red'
            fluid
            basic
            content='Unfollow user'
          />
        ) : (
          <Button
            onClick={() => followUser(profile)}
            color='teal'
            fluid
            basic
            content='Follow user'
          />
        )}
      </Segment>
    </Grid.Column>
  );
};

export default UserDetailedSidebar;
