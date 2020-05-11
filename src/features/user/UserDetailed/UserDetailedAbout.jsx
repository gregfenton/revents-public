import React from "react";
import { Segment, Header, Grid } from "semantic-ui-react";
import { format } from "date-fns";
import UserDetailedInterests from "./UserDetailedInterests";

const UserDetailedAbout = ({ profile }) => {
  let occ, orig, memberSince;

  occ = profile.occupation ? profile.occupation : "TBN";
  orig = profile.origin ? profile.origin : "TBN";
  memberSince = (profile.createdAt && format(profile.createdAt.toDate(), "dd LLL yyyy"));

  return (
    <Segment>
      <Grid columns={2}>
        <Grid.Column width={10}>
          <Header icon='smile' content='About Display Name' />
          <p>
            I am a: <strong>{occ}</strong>
          </p>
          <p>
            Originally from <strong>{orig}</strong>
          </p>
          <p>
            Member Since:{" "}
            <strong>{memberSince}</strong>
          </p>
        </Grid.Column>
        <Grid.Column width={6}>
          <UserDetailedInterests profile={profile} />
        </Grid.Column>
        {profile.about && (
          <Grid.Column width={16}>
            <div className="ui tertiary segment">{profile.about}</div>
          </Grid.Column>
        )}
      </Grid>
    </Segment>
  );
};

export default UserDetailedAbout;
