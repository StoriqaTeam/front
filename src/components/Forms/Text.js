// @flow

import React from 'react';

// import { log } from 'utils';

type PropsType = {
  id: string,
  label: string,
  value: string,
  onChange: Function,
  styleName: ?string,
};

const Text = ({
  id,
  label,
  value,
  onChange,
  styleName = '',
}: PropsType) => (
  <label htmlFor={id}>
    {label}
    <br />
    <input
      name={id}
      type="text"
      value={value}
      onChange={onChange}
      styleName={styleName}
    />
  </label>
);

export default Text;
