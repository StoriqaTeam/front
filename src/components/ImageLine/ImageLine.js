// @flow strict

import React from 'react';

import './ImageLine.scss';

type PropsType = {
  items: Array<{ id: string, image: string }>,
};

const ImageLine = ({ items }: PropsType) => (
  <div styleName="wrapper">
    <div styleName="scrollWrapper">
      {items.map(item => (
        <div
          key={item.id}
          styleName="item"
          style={{ backgroundImage: `url(${item.image})` }}
        />
      ))}
    </div>
  </div>
);

export default ImageLine;
