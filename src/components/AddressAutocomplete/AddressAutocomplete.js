// @flow

import React, { Fragment, Component } from 'react';

import { log } from 'utils';
import LoadScript from 'libs/react-load-script';

import { getScriptURL } from './utils';

type PropsType = {
  //
};

type StateType= {
  //
};

class AddressAutocomplete extends Component<PropsType, StateType> {
  render() {
    log.debug({ googleApiUrl: getScriptURL() });
    return (
      <Fragment>
        <LoadScript
          url={getScriptURL()}
          onError={() => log.error('Loading error')}
          onLoad={() => log.debug('Loaded successfully')}
        />
      </Fragment>
    );
  }
}

export default AddressAutocomplete;
