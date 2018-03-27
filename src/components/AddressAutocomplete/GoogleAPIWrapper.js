// @flow

import React, { Component } from 'react';
import type { Node } from 'react';
import { log } from 'utils';
import LoadScript from 'libs/react-load-script';
import { getScriptURL } from './utils';


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

  autocompleteService: { getPlacePredictions: Function };
  geocoderService: { geocode: Function };

  render() {
    const { children } = this.props;
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
            // $FlowIgnore
            this.autocompleteService = new google.maps.places.AutocompleteService();
            this.geocoderService = new google.maps.Geocoder();
            /* eslint-enable */
          }}
        />
      );
    } else if (isGoogleMapsApiScriptLoading) {
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
