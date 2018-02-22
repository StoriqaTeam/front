// @flow

import React from 'react';

import './Main.scss';

const Main = (props: any) => (
  <main styleName="container">
    { props.children }
  </main>
);

export default Main;
