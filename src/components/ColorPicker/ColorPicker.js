// @flow

import React from 'react';

import './ColorPicker.scss';

type PropsType = {
  items: Array<string>,
  value: string,
  onSelect: (value: string) => void,
};

const Checkbox = ({
  items,
  value,
  onSelect,
}: PropsType) => (
  <div styleName="container">
    {items.map(color => (
      <div
        key={color}
        styleName="itemWrapper"
        style={{
          borderColor: value === color ? color : 'transparent',
        }}
      >
        <div
          onClick={() => onSelect(color)}
          styleName="item"
          onKeyDown={() => { }}
          role="button"
          tabIndex="0"
          style={{
            backgroundColor: color,
          }}
        />
      </div>
    ))}
  </div>
);

export default Checkbox;
