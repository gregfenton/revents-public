import React from "react";
import PlacesAutocomplete, {
//   geocodeByAddress,
//   getLatLng
} from "react-places-autocomplete";

class TestPlaceInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = { address: "" };
  }

  handleChange = address => {
    this.setState({ address });
  };

  //   handleSelect = address => {
  //     geocodeByAddress(address)
  //       .then(results => getLatLng(results[0]))
  //       .then(latlng => console.log("Success", latlng))
  //       .catch(error => console.error("Error", error));
  //   };

  render() {
    const { selectAddress } = this.props;

/*     console.log("TestPlaceInput - state is: ", this.state);
    console.log("TestPlaceInput - props is: ", this.props);
 */
    return (
      <PlacesAutocomplete
        value={this.state.address}
        onChange={this.handleChange}
        onSelect={selectAddress}
        searchOptions={this.options}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <input
              {...getInputProps({
                placeholder: "Search Places ...",
                className: "location-search-input"
              })}
            />
            <div className='autocomplete-dropdown-container'>
              {loading && <div>Loading...</div>}
              {suggestions.map(suggestion => {
                const className = suggestion.active
                  ? "suggestion-item--active"
                  : "suggestion-item";
                // inline style for demonstration purpose
                const style = suggestion.active
                  ? { backgroundColor: "#fafafa", cursor: "pointer" }
                  : { backgroundColor: "#ffffff", cursor: "pointer" };
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style
                    })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
    );
  }
}

export default TestPlaceInput;
