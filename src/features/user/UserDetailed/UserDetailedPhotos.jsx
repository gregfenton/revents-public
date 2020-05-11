import React from "react";
import { Segment, Header, Image } from "semantic-ui-react";
import { connect } from "react-redux";
import LazyLoad from "react-lazyload";

const mapState = state => ({
  auth: state.firebase.auth,
  profile: state.firebase.profile
});

const UserDetailedPhotos = ({ photos }) => {
  return (
    <Segment attached>
      <Header icon='image' content='Photos' />

      <Image.Group size='small'>
        {photos &&
          photos.map(p => (
            <LazyLoad
              key={p.id}
              height={150}
              // offset={-150}   // defer loading of images until the user scrolls the page below this viewport value
              placehoder={<Image src='/assets/user.png' />}
            >
              <Image src={p.url} />
            </LazyLoad>
          ))}
      </Image.Group>
    </Segment>
  );
};

export default connect(mapState, null)(UserDetailedPhotos);
