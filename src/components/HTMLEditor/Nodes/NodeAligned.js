// @flow strict
import React from 'react';
import type { Node } from 'react';

type PropsType = {
  attributes: {
    [string]: boolean,
  },
  children: Node,
  align: string,
};

const NodeAligned = ({ children, attributes, align }: PropsType) => (
  <div style={{ textAlign: align }} {...attributes}>
    {children}
  </div>
);

export default NodeAligned;
