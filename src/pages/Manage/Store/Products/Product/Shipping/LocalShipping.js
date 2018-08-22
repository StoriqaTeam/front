// @flow

import React, { PureComponent } from 'react';

import { RadioButton } from 'components/common/RadioButton';

import { FixPriceForm } from '../index';

import './LocalShipping.scss';

type StateType = {
  isCheckedPickup: boolean,
  isCheckedFixPrice: boolean,
};

type PropsType = {
  //
};

class LocalShipping extends PureComponent<PropsType, StateType> {
  state = {
    isCheckedPickup: false,
    isCheckedFixPrice: true,
  };

  handleOnChangeRadio = (id: string) => {
    this.setState({
      isCheckedPickup: id === 'localShippingPickup',
      isCheckedFixPrice: id !== 'localShippingPickup',
    });
  };

  render() {
    const { isCheckedPickup, isCheckedFixPrice } = this.state;
    return (
      <div styleName="container">
        <div styleName="title">
          <strong>Local shipping</strong>
        </div>
        <div styleName="radioButtons">
          <div styleName="radioButton">
            <RadioButton
              id="localShippingPickup"
              label="Without delivery, only pickup"
              isChecked={isCheckedPickup}
              onChange={this.handleOnChangeRadio}
            />
          </div>
          <div styleName="radioButton">
            <RadioButton
              id="localShippingFixPrice"
              label="Fixed, single price for all"
              isChecked={isCheckedFixPrice}
              onChange={this.handleOnChangeRadio}
            />
          </div>
        </div>
        <div styleName="form">
          <FixPriceForm />
        </div>
      </div>
    );
  }
}

export default LocalShipping;
