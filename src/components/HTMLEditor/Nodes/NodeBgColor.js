import React from 'react';
import type { Node } from 'react';

import type { NodeColorType } from '../types';

const colorsHashMap: { [NodeColorType]: string } = {
  gray: '#505050',
  blue: '#03A9FF',
  pink: '#FF62A4',
};

type PropsType = {
  children: Node,
  color: string,
  attributes: {
    [string]: boolean,
  },
};

const NodeBgColor = ({ children, attributes, color }: PropsType) => (
  <span {...attributes} style={{ backgroundColor: colorsHashMap[color] }}>
    {children}
  </span>
);

export default NodeBgColor;
