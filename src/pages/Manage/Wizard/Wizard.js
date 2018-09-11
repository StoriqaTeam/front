// @flow strict

import * as React from 'react';

import { Main, FooterResponsive } from 'components/App';

import './Wizard.scss';

type PropsType = {
  me: ?{},
  children: React.Element<*>,
};

const Wizard = (props: PropsType) => (
  <div styleName="container">
    <div styleName="headerMock" />
    <Main>
      <div styleName="wizardContainer">
        {React.cloneElement(props.children, { me: props.me })}
      </div>
    </Main>
    <FooterResponsive />
  </div>
);

export default Wizard;
