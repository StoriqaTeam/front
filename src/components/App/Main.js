// @flow

import React from 'react';

import './Main.scss';

const Main = (props: any) => (
  <main styleName="container">
    <div styleName="wrap">
      { props.children }
    </div>
  </main>
);

export default Main;
