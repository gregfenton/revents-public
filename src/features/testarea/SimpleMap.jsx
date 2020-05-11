import React, { Component } from "react";
import GoogleMapReact from "google-map-react";
import { Icon } from "semantic-ui-react";

const AnyReactComponent = () => <Icon name='marker' size='big' color='red' />;

class SimpleMap extends Component {
  /*   static defaultProps = {
    zoom: 11
  };
 */

  render() {
    const { cityLatLng, zoom } = this.props;

    return (
      // Important! Always set the container height explicitly
      <div style={{ height: "300px", width: "100%" }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyC1-5_xpUU_flt1TQPY23AAsgefsFoM9qY" }}
          defaultCenter={cityLatLng}
          defaultZoom={zoom}
        >
          <AnyReactComponent
            lat={cityLatLng.lat}
            lng={cityLatLng.lng}
          />
        </GoogleMapReact>
      </div>
    );
  }
}

export default SimpleMap;
