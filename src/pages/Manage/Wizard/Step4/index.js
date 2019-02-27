// @flow strict

import React, { PureComponent } from 'react';

import { Cards } from 'pages/Manage/Store/Finances';

import type { MeType } from '../Wizard';

import './Step4.scss';

type PropsType = {
  me: MeType,
};

class Step4 extends PureComponent<PropsType> {
  render() {
    const { me } = this.props;
    return (
      <div styleName="container">
        <div styleName="cards">
          <Cards me={me} wizard />
        </div>
      </div>
    );
  }
}

export default Step4;
