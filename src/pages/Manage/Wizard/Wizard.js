// @flow strict

import React from 'react';

import { Main, FooterResponsive } from 'components/App';

import Stepper from './Stepper';

import './Wizard.scss';

type PropsType = {
  me: ?{},
};

const Wizard = (props: PropsType) => (
  <div styleName="container">
    <div styleName="headerMock" />
    <Main>
      <div styleName="wizardContainer">
        <Stepper me={props.me} />
      </div>
    </Main>
    <FooterResponsive />
  </div>
);

export default Wizard;
