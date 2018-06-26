// @flow

import React from 'react';

import { Checkbox } from 'components/common/Checkbox';
import { Select } from 'components/common/Select';

import './CheckoutProducts.scss';
import { pathOr } from 'ramda';

class CheckoutContent extends React.Component<PropsType> {
  state = {
    step: 1,
    // deliveryAddress: null,
  };

  render() {
    const { step } = this.state;
    // const { me } = this.props;
    // console.log('>>> checkout me', { me });
    return (
      <div styleName="container">
        <div styleName="title">Submit</div>
      </div>
    );
  }
}

export default CheckoutContent;
