// @flow

import React, { PureComponent } from 'react';

import { log } from 'utils';

type PropsType = {
  //
};

class RadioGroup extends PureComponent<PropsType> {
  handleCheck = (e: any) => log.debug({ e });
  render() {
    return (
      <div>!</div>
    );
  }
}

export default RadioGroup;
