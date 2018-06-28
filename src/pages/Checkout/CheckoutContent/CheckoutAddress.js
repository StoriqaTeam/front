// @flow

import React from 'react';
import { filter, find, map, pathOr } from 'ramda';

import { Checkbox } from 'components/common/Checkbox';
import { Select } from 'components/common/Select';
import { Input } from 'components/common/Input';
import { Row, Col } from 'layout';
import { RadioGroup } from 'components/Forms';
import { AddressForm } from 'components/AddressAutocomplete';

import type { AddressFullType } from 'components/AddressAutocomplete/AddressForm';

import { getAddressFullByValue, addressesToSelect } from '../utils';

import './CheckoutAddress.scss';

type AddressItemType = {
  id: string,
  label: string,
};

type PropsType = {
  deliveryAddresses: any,
  onChangeOrderInput: Function,
  onChangeAddressType: Function,
  orderInput: any,
  isAddressSelect: boolean,
  isNewAddress: boolean,
  // onSelectAddress: (item: AddressItemType) => void,
};

class CheckoutContent extends React.Component<PropsType> {
  handleOnSelectAddress = item => {
    const { onChangeOrderInput, orderInput, deliveryAddresses } = this.props;
    const addressFull = getAddressFullByValue(deliveryAddresses, item.label);
    onChangeOrderInput({
      ...orderInput,
      addressFull,
    });
  };

  handleChangeReceiver = (e: any) => {
    const { onChangeOrderInput, orderInput } = this.props;
    onChangeOrderInput({
      ...orderInput,
      receiverName: e.target.value,
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

  handleInputChange = (id: string) => (e: any) => {
    const { onChangeOrderInput, orderInput } = this.props;
    const { value } = e.target;
    console.log('>>> handle Input change: ', { id, value });
    onChangeOrderInput({
      ...orderInput,
      addressFull: {
        ...orderInput.addressFull,
        [id]: value,
      },
    });
    // this.setState(
    //   assocPath(['form', id], value.replace(/\s\s/, ' '), this.state),
    // );
  };

  handleChangeData = (addressFullData: AddressFullType): void => {
    const { onChangeOrderInput, orderInput } = this.props;
    onChangeOrderInput({
      ...orderInput,
      addressFull: addressFullData,
    });
  };

  render() {
    const {
      isAddressSelect,
      isNewAddress,
      orderInput,
      onChangeAddressType,
      deliveryAddresses,
    } = this.props;
    console.log('>>> orderInput');

    const { addressFull } = orderInput;

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
                isChecked={isAddressSelect}
                onChange={onChangeAddressType}
              />
              {isAddressSelect && (
                <div styleName="selectWrapper">
                  Address
                  <Select
                    items={addressesToSelect(deliveryAddresses)}
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
                isChecked={isNewAddress}
                onChange={onChangeAddressType}
              />

              {isNewAddress && (
                <div styleName="formWrapper">
                  <AddressForm
                    // onChangeFormInput={this.handleInputChange}
                    isOpen
                    onChangeData={this.handleChangeData}
                    country={addressFull ? addressFull.country : null}
                    address={addressFull ? addressFull.value : null}
                    addressFull={addressFull}
                  />
                </div>
              )}
            </div>
          </div>
        </Col>
      </Row>
    );
  }
}

export default CheckoutContent;
