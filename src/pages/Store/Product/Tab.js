// @flow

import * as React from 'react';

import './Tab.scss';

type PropsType = {
  children: string,
};

const Tab = (props: PropsType) => <div styleName="tab">{props.children}</div>;

export default Tab;
