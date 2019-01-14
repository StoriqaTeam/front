import React from 'react';

import type { NodeColorType } from '../types';

const colorsHashMap: { [NodeColorType]: string } = {
  gray: '#505050',
  blue: '#03A9FF',
  pink: '#FF62A4',
};

const NodeColor = (props: PropsType) => {
  const { children, attributes } = props;
  return (
    <span {...attributes} style={{ color: colorsHashMap[props.color] }}>
      {children}
    </span>
  );
};

export default NodeColor;
