// @flow

import React from 'react';

import './Checkbox.scss';

type PropsType = {
  id: string,
  label: boolean,
  labelStyle: ?{
    [key: string]: any,
  },
  isChecked: boolean,
  handleCheckboxChange: Function,
};

const Checkbox = ({
  id,
  label,
  isChecked,
  labelStyle,
  handleCheckboxChange,
}: PropsType) => (
  <div styleName="container">
    <input
      styleName="input"
      id={id}
      type="checkbox"
      checked={isChecked}
      onChange={() => handleCheckboxChange(id)}
    />
    <label
      htmlFor={id}
      styleName={`label ${isChecked ? 'active' : ''}`}
      style={labelStyle || {}}
    >
      <span styleName="labelText">{label}</span>
    </label>
  </div>
);

export default Checkbox;
