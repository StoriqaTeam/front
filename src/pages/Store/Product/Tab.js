// @flow

import * as React from 'react';

import './Tab.scss';

type propsTypes = {
  children: React.Node
}

const Tab = (props: propsTypes) => (
  <div styleName="tab">
    { props.children }
  </div>
);

export default Tab;
