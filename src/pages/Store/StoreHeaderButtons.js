// @flow

import React from 'react';

import { Button } from 'components/common/Button';
import { Icon } from 'components/Icon';

import './StoreHeaderButtons.scss';

const StoreHeaderButtons = () => (
  <div styleName="container">
    <Button big>
      <span styleName="buttonText">
        <span styleName="buttonIcon email">
          <Icon type="email" size={20} />
        </span>
        <span styleName="message">Message to</span>  seller
      </span>
    </Button>
    <Button big wireframe onClick={() => {}}>
      <span styleName="buttonText">
        <span styleName="buttonIcon phone">
          <Icon type="phone" size={20} />
        </span>{' '}
        Call seller
      </span>
    </Button>
  </div>
);

export default StoreHeaderButtons;
