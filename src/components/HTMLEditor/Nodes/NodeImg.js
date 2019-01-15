// @flow string

import React from 'react';

type PropsType = {
  attributes: {
    [string]: boolean,
  },
  src: string,
  selected: boolean,
};

const NodeImg = ({ attributes, src, selected }: PropsType) => (
  <img
    {...attributes}
    src={src}
    alt=""
    style={{
      display: 'block',
      maxWidth: '100%',
      maxHeight: '20em',
      boxShadow: selected ? '0 0 0 2px blue' : 'none',
    }}
  />
);

export default NodeImg;
