// @flow strict

import React from 'react';
import type { Node } from 'react';

import './Tab.scss';

type PropsType = {
  children: Node,
};

const Tab = (props: PropsType) => <div styleName="tab">{props.children}</div>;

export default Tab;
