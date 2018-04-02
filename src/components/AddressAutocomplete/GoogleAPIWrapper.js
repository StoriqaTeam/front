// @flow

import React, { Component } from 'react';
import type { Node } from 'react';

type StateType= {
  isGoogleMapsApiScriptLoaded: boolean,
  isGoogleMapsApiScriptLoading: boolean,
};

type PropsType = {
  children: Node,
}

class GoogleAPIWrapper extends Component<PropsType, StateType> {
  state: StateType = {
    isGoogleMapsApiScriptLoaded: false,
    isGoogleMapsApiScriptLoading: false,
  };

  componentDidMount() {
    this.fetchGoogleApi();
  }

  autocompleteService: { getPlacePredictions: Function };
  geocoderService: { geocode: Function };

  fetchGoogleApi = async () => {
    /* eslint-disable */ 
    // $FlowIgnore
    if (google) {
      this.autocompleteService = new google.maps.places.AutocompleteService();
      this.geocoderService = new google.maps.Geocoder();
      /* eslint-disable */ 
      const isGoogleMapsApiScriptLoaded = !!this.autocompleteService && !!this.geocoderService;
      const isGoogleMapsApiScriptLoading = !this.autocompleteService || !this.geocoderService;
      this.setState({
        isGoogleMapsApiScriptLoaded,
        isGoogleMapsApiScriptLoading,
      });
    }
  }

  render() {
    const { children } = this.props;
    const { isGoogleMapsApiScriptLoading, isGoogleMapsApiScriptLoaded } = this.state;
    if ((isGoogleMapsApiScriptLoading && !isGoogleMapsApiScriptLoaded)
    || (isGoogleMapsApiScriptLoading && !isGoogleMapsApiScriptLoaded)) {
      return (
        <div>loading</div>
      );
    } else if (isGoogleMapsApiScriptLoaded) {
      return React.Children.map(children, child =>
        React.cloneElement(child, {
          autocompleteService: this.autocompleteService,
          geocoderService: this.geocoderService,
        }));
    }
    return null;
  }
}

const wrapper = (WrappedComponent: Class<React$Component<*, *>>) => (props: any) => (
  <GoogleAPIWrapper>
    <WrappedComponent {...props} />
  </GoogleAPIWrapper>
);

export default wrapper;
