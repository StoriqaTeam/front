// @flow

import React, { PureComponent } from 'react';

import { Select } from 'components/common/Select';

import './FixPriceForm.scss';

type StateType = {
  isCheckedPickup: boolean,
  isCheckedFixPrice: boolean,
};

type PropsType = {
  //
};

class FixPriceForm extends PureComponent<PropsType, StateType> {
  state = {
    isCheckedPickup: false,
    isCheckedFixPrice: true,
  };

  render() {
    const { isCheckedPickup, isCheckedFixPrice } = this.state;
    return (
      <div styleName="container">
        <div className="selects">
          <div className="service">
            <Select items={[{ id: 'ups', label: 'UPS' }]} />
          </div>
          <div className="price">
            <Select />
          </div>
        </div>
      </div>
    );
  }
}

export default FixPriceForm;
