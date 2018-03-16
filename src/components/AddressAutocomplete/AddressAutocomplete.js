// @flow

import React, { Component } from 'react';
import Autocomplete from 'react-autocomplete';
import { isEmpty, map, pathOr } from 'ramda';
import debounce from 'lodash.debounce';

import { log } from 'utils';
import LoadScript from 'libs/react-load-script';


import { getScriptURL } from './utils';

type PropsType = {
  country: string,
  onSelect: Function,
  searchType: '(cities)' | 'geocode',
  // isCities: boolean,
  // forCity?: string,
};

type StateType= {
  isGoogleMapsApiScriptLoaded: boolean,
  isGoogleMapsApiScriptLoading: boolean,
  value: string,
  predictions: Array<{ mainText: string, secondaryText: '' }>,
};

class AddressAutocomplete extends Component<PropsType, StateType> {
  constructor(props) {
    super(props);
    this.handleInputChange = debounce(this.handleInputChange, 250);
  }

  state: StateType = {
    isGoogleMapsApiScriptLoaded: false,
    isGoogleMapsApiScriptLoading: false,
    value: '',
    predictions: [],
  };

  handleSearch = (predictions, status) => {
    log.debug({ predictions });
    // eslint-disable-next-line
    if (status !== google.maps.places.PlacesServiceStatus.OK) {
      return;
    }

    const formattedResult = map(item => ({
      mainText: pathOr(null, ['structured_formatting', 'main_text'], item),
      secondaryText: pathOr(null, ['structured_formatting', 'secondary_text'], item),
    }), predictions);
    // log.debug({ formattedResult });
    this.setState({ predictions: formattedResult });
  };

  handleInputChange = (value) => {
    if (isEmpty(value)) {
      this.setState({ predictions: [] });
      return;
    }
    // log.debug({ value });
    this.autocompleteService.getPlacePredictions(
      {
        input: value,
        componentRestrictions: {
          country: this.props.country,
        },
        types: this.props.searchType ? [this.props.searchType] : null,
      },
      this.handleSearch,
    );
  };

  renderComponent = () => (

    <Autocomplete
      id="someId"
      items={this.state.predictions}
      getItemValue={item => item.mainText}
      renderItem={item => (<div>{item.mainText}</div>)}
      renderInput={props => (<input {...props} style={{ border: 'red 1px solid' }} />)}
      onChange={(e) => {
        const { value } = e.target;
        this.setState({ value });
        this.handleInputChange(value);
      }}
      value={this.state.value}
      onSelect={(value, item) => {
        this.setState({ value });
        this.props.onSelect(value, item);
      }}
    />
  );

  render() {
    const { isGoogleMapsApiScriptLoading, isGoogleMapsApiScriptLoaded } = this.state;
    if (!isGoogleMapsApiScriptLoading && !isGoogleMapsApiScriptLoaded) {
      return (
        <LoadScript
          url={getScriptURL()}
          onCreate={() => this.setState({ isGoogleMapsApiScriptLoading: true })}
          onError={() => log.error('Loading error')}
          onLoad={() => {
            log.debug('loaded');
            this.setState({
              isGoogleMapsApiScriptLoaded: true,
              isGoogleMapsApiScriptLoading: false,
            });
            /* eslint-disable */
            this.autocompleteService = new google.maps.places.AutocompleteService();
            //this.placesService = google.maps.places.PlacesService(document.getElementById('someId'));
            /* eslint-enable */
          }}
        />
      );
    } else if (isGoogleMapsApiScriptLoading) {
      return (
        <div>loading</div>
      );
    } else if (isGoogleMapsApiScriptLoaded) {
      return this.renderComponent();
    }
    return null;
  }
}

export default AddressAutocomplete;
