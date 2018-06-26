// @flow

import React from 'react';
import { filter, find, map, pathOr } from 'ramda';

import { Checkbox } from 'components/common/Checkbox';
import { Select } from 'components/common/Select';
import { Input } from 'components/common/Input';
import { Row, Col } from 'layout';

import './CheckoutAddress.scss';

type AddressItemType = {
  id: string,
  label: string,
};

type PropsType = {
  deliveryAddresses: any,
  // onSelectAddress: (item: AddressItemType) => void,
};

class CheckoutContent extends React.Component<PropsType> {
  constructor(props: PropsType) {
    super(props);
    // const addressValue = pathOr(null, ['orderInput', 'addressFull', 'value'], props);
    // const findInAddresses = filter(, this.getDeliveryItems(porp));
    this.state = {
      step: 1,
      // deliveryItem: null,
      isCheckedExistingAddress:
        props.deliveryAddresses && props.deliveryAddresses.length > 0,
      isCheckedNewAddress: false,
    };
  }

  getDeliveryItems = () => {
    const { deliveryAddresses } = this.props;
    return map(i => {
      if (!i.address || !i.address.value) {
        return null;
      }
      return { id: i.address.value, label: i.address.value };
    }, deliveryAddresses);
  };

  getDeliveryItemByValue = value => {
    const { deliveryAddresses } = this.props;
    console.log('>>> getDeliveryItemByValue value: ', {
      value,
      deliveryAddresses,
    });
    const addressValue = find(
      item => item.address.value === value,
      deliveryAddresses,
    );
    return addressValue.address;
  };

  handleOnSelectAddress = item => {
    console.log('>>> handle on select address item: ', { item });
    const { onChangeOrderInput, orderInput } = this.props;
    const addressFull = this.getDeliveryItemByValue(item.label);

    onChangeOrderInput({
      ...orderInput,
      addressFull,
    });
    // this.setState({ selectedAddress: item });
  };

  // handleOnChangeNewAddress = (data: any) => {
  //   this.setState(prevState => ({}));
  // };
  handleChangeReceiver = (receiverName: string) => {
    const { onChangeOrderInput, orderInput } = this.props;
    onChangeOrderInput({
      ...orderInput,
      receiverName,
    });
  };

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
      // deliveryItems,
      orderInput,
    } = this.props;
    // console.log('>>> checkout me', { me });
    console.log('>>> orderInput');
    const addressValue = pathOr(
      null,
      ['orderInput', 'addressFull', 'value'],
      this.props,
    );
    return (
      <Row>
        <Col size={6}>
          <div styleName="container">
            <div styleName="title">Delivery info</div>
            <div styleName="receiverContainer">
              <Input
                fullWidth
                id="receiverName"
                label="Receiver name"
                onChange={this.handleChangeReceiver}
                value={orderInput.receiverName}
                limit={50}
              />
            </div>
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
                    items={this.getDeliveryItems()}
                    activeItem={
                      addressValue && { id: addressValue, label: addressValue }
                    }
                    onSelect={this.handleOnSelectAddress}
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
                <div styleName="selectWrapper">address full</div>
              )}
            </div>
          </div>
        </Col>
      </Row>
    );
  }
}

export default CheckoutContent;
