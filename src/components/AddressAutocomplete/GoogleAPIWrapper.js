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

  // autocompleteService: any;
  // geocoderService: any;

  // constructor(props: PropsType) {
  //   super(props);
  //   this.autocompleteService = this.autocompleteService;
  //   this.geocoderService = this.geocoderService;
  // }

  state: StateType = {
    isGoogleMapsApiScriptLoaded: false,
    isGoogleMapsApiScriptLoading: false,
  };

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
            // $FlowIgnore
            this.autocompleteService = new google.maps.places.AutocompleteService();
            // $FlowIgnore
            this.geocoderService = new google.maps.Geocoder();
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
          // $FlowIgnore
          autocompleteService: this.autocompleteService,
          // $FlowIgnore
          geocoderService: this.geocoderService,
        }));
    }
    return null;
  }
}

export default GoogleAPIWrapper;
