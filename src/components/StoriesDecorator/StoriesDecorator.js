// @flow

import React from 'react';
import type { Node } from 'react';
import classNames from 'classnames';

import './StoriesDecorator.scss';

const StoriesDecorator = (props: { children: Node, type: string }) => (
  <div styleName={classNames('container', props.type)}>
    <div styleName="cell">
      { props.children }
    </div>
  </div>
);

export default StoriesDecorator;
