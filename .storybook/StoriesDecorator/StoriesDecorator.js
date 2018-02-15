// @flow

import React from 'react';
import type { Node } from 'react';
import classNames from 'classnames';

import './StoriesDecorator.scss';

const StoriesDecorator = (props: { children: Node, kind: string }) => {
  const { kind, children } = props;
  let modifCls = null;

  switch (kind) {
    case 'Icons': {
      modifCls = 'icons';
      break;
    };
    case 'CardProduct': {
      modifCls = 'cardProduct';
      break;
    };
    case 'Slider': {
      modifCls = 'slider';
      break;
    };
    default: modifCls = null;
  }

  return (
    <div styleName={classNames('container', modifCls )}>
      <div styleName="cell">
        { children }
      </div>
    </div>
  );
};

export default StoriesDecorator;
