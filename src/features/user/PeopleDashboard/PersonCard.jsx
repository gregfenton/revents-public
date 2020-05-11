import React, { Fragment } from "react";
import { Card, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";

const PersonCard = ({ person }) => {
  console.log("person: ", person);
  return (
    <Fragment>
      {person && (
        <Card as={Link} to={'/profile/' + person.userId}>
          <Image src={person.photoURL} />
          <Card.Content textAlign='center'>
            <Card.Header content={person.displayName} />
          </Card.Content>
          <Card.Meta textAlign='center'>
            <span>{person.city}</span>
          </Card.Meta>
        </Card>
      )}
    </Fragment>
  );
};

export default PersonCard;
