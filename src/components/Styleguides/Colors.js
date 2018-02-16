// @flow

import React from 'react';

import './Colors.scss';

import colors from './colors.json';

const Colors = () => (
  <div styleName="container">
    {colors.map(item => (
      <div key={item.var} styleName="item">
        <div styleName="var">{ item.var }</div>
        <div styleName="info">
          <div
            styleName="box"
            style={{
              backgroundColor: item.code,
              border: `1px solid ${item.code === '#FFFFFF' ? '#CCCCCC' : item.code}`,
            }}
          />
          <div styleName="desc">
            <div styleName="name">{ item.name }</div>
            <div styleName="code">{ item.code }</div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default Colors;
