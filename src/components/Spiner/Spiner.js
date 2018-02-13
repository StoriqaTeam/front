import React from 'react';

import { Icon } from 'components/Icon';

import './Spiner.scss';

const Spiner = (props: { size: 16 | 24 | 32 }) => (
  <div
    styleName="container"
    style={{
      marginTop: -props.size / 2,
      marginLeft: -props.size / 2,
    }}
  >
    <Icon
      type="spiner"
      size={props.size}
    />
  </div>
);

export default Spiner;
