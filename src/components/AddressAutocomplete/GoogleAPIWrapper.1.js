// @flow

import React, { Component } from 'react';
import type { Node } from 'react';
import { log } from 'utils';
import LoadScript from 'libs/react-load-script';
import PropTypes from 'prop-types';
import { getScriptURL } from './utils';
// import AutocompleteComponent from './AutocompleteComponent';


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

  getChildContext() {
    /* eslint-disable */
    return {
      autocompleteService: this.autocompleteService,
      geocoderService: this.geocoderService,
    };
    /* eslint-enable */
  }

  render() {
    const { children } = this.props;
    const { isGoogleMapsApiScriptLoading, isGoogleMapsApiScriptLoaded } = this.state;
    // children.forEach(c => console.log('&&& child type', typeof c, {type: c.type}));
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
            // $FlowIgnore
            this.geocoderService = new google.maps.Geocoder();
            console.log('^^^^^ GoogleAPIWrapper geocoderService: ', this.geocoderService);
            /* eslint-enable */
          }}
        />
      );
    } else if (isGoogleMapsApiScriptLoading) {
      return (
        <div>loading</div>
      );
    } else if (isGoogleMapsApiScriptLoaded) {
      return children;
    }
    return null;
  }
}

GoogleAPIWrapper.childContextTypes = {
  autocompleteService: PropTypes.object,
  geocoderService: PropTypes.object,
};

export default GoogleAPIWrapper;
