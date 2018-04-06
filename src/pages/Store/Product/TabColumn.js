// @flow

import React from 'react';

import './TabColumn.scss';

type propsTypes = {
  items: {id: string | number, label: string, text: string}[],
}

const TabColumn = (props: propsTypes) => (
  <div styleName="container">
    {props.items.map(({ label, text }) => (
      <div styleName="columnItem">
        <h6>{ label }</h6>
        <small>{ text }</small>
      </div>
    ))}
  </div>
);

export default TabColumn;
