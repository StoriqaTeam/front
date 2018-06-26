// @flow

import React from 'react';

import { Checkbox } from 'components/common/Checkbox';
import { Select } from 'components/common/Select';

import './CheckoutAddress.scss';

type AddressItemType = {
  id: string,
  label: string,
};

type PropsType = {
  deliveryItems: Array<AddressItemType>,
  onSelectAddress: (item: AddressItemType) => void,
};

class CheckoutContent extends React.Component<PropsType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      step: 1,
      deliveryItem: null,
      isCheckedExistingAddress:
        props.deliveryItems && props.deliveryItems.length > 0,
      isCheckedNewAddress: false,
    };
  }

  handleOnCheckExistingAddress = () => {
    console.log('>>> handle on check existing address: ');
    this.setState(({ isCheckedExistingAddress }) => ({
      isCheckedExistingAddress: !isCheckedExistingAddress,
    }));
  };

  handleOnCheckNewAddress = () => {
    console.log('>>> handle on check new address: ');
    this.setState(({ isCheckedNewAddress }) => ({
      isCheckedNewAddress: !isCheckedNewAddress,
    }));
  };

  render() {
    const { step, isCheckedExistingAddress, isCheckedNewAddress } = this.state;
    const {
      me,
      deliveryItems,
      selectedAddress,
      onSelectAddress,
      newAddress,
    } = this.props;
    console.log('>>> checkout me', { me });
    return (
      <div styleName="container">
        <div styleName="title">Delivery info</div>
        <div styleName="selectAddressContainer">
          <Checkbox
            id="existingAddressCheckbox"
            label="choose your address"
            isChecked={isCheckedExistingAddress}
            onChange={this.handleOnCheckExistingAddress}
          />

          {isCheckedExistingAddress && (
            <div styleName="selectWrapper">
              Address
              <Select
                items={deliveryItems}
                activeItem={selectedAddress}
                onSelect={onSelectAddress}
                forForm
                containerStyle={{ width: '24rem' }}
              />
            </div>
          )}
        </div>
        <div styleName="newAddressForm">
          <Checkbox
            id="newAddressCheckbox"
            label="Or fill fields below and save as address"
            isChecked={isCheckedNewAddress}
            onChange={this.handleOnCheckNewAddress}
          />
          {isCheckedNewAddress && (
            <div styleName="selectWrapper">
              Address
              <Select
                items={deliveryItems}
                activeItem={selectedAddress}
                onSelect={onSelectAddress}
                forForm
                containerStyle={{ width: '24rem' }}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default CheckoutContent;
