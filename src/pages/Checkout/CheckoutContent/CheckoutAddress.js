// @flow

import React from 'react';
import { find, propEq, head, filter, addIndex, map } from 'ramda';

import { Checkbox } from 'components/common/Checkbox';
import { RadioButton } from 'components/common/RadioButton';
import { Select } from 'components/common/Select';
import { Input } from 'components/common/Input';
import { Container, Row, Col } from 'layout';
import { AddressForm } from 'components/AddressAutocomplete';

import { addressToString } from 'utils';

import type { AddressFullType, SelectItemType } from 'types';

import { addressesToSelect } from '../utils';

import AddressInfo from './AddressInfo';

import './CheckoutAddress.scss';

type PropsType = {
  deliveryAddresses: Array<{
    address: AddressFullType,
    isPriority: boolean,
  }>,
  onChangeOrderInput: Function,
  onChangeAddressType: Function,
  onChangeSaveCheckbox: Function,
  orderInput: any,
  me: any,
  isAddressSelect: boolean,
  isNewAddress: boolean,
  saveAsNewAddress: boolean,
};

type StateType = {
  addresses: Array<{ id: string, label: string }>,
  selectedAddress: ?{
    id: string,
    label: string,
  },
};

class CheckoutContent extends React.Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);

    const { deliveryAddresses } = props;
    const addresses = addressesToSelect(deliveryAddresses);
    const selectedAddress =
      find(propEq('id', '0'))(addresses) || head(addresses);

    this.handleOnSelectAddress(selectedAddress);
    this.state = {
      addresses,
      selectedAddress,
    };
  }

  componentDidUpdate(prevProps: PropsType) {
    const { isAddressSelect } = this.props;
    if (isAddressSelect && prevProps.isAddressSelect !== isAddressSelect) {
      const { deliveryAddresses } = this.props;
      const addresses = addressesToSelect(deliveryAddresses);
      const selectedAddress =
        find(propEq('id', '0'))(addresses) || head(addresses);

      this.handleOnSelectAddress(selectedAddress);
    }
  }

  handleOnSelectAddress = (item: ?SelectItemType) => {
    const { onChangeOrderInput, orderInput, deliveryAddresses } = this.props;
    this.setState({ selectedAddress: item });

    const newDeliveryAddresses = filter(
      newAddressItem => Boolean(newAddressItem.needed),
      addIndex(map)(
        (addressItem, idx) => ({
          ...addressItem,
          needed:
            (item && item.id === '0' && addressItem.isPriority) ||
            (item && item.id === `${idx + 1}`),
        }),
        deliveryAddresses,
      ),
    );

    const deliveryAddress = head(newDeliveryAddresses);

    if (deliveryAddress) {
      const addressFull = deliveryAddress.address;
      onChangeOrderInput({
        ...orderInput,
        addressFull,
      });
    }
  };

  handleChangeReceiver = (e: any) => {
    const { onChangeOrderInput, orderInput } = this.props;
    onChangeOrderInput({
      ...orderInput,
      receiverName: e.target.value,
    });
  };

  handleChangePhone = (e: any) => {
    const { onChangeOrderInput, orderInput } = this.props;
    const { value } = e.target;
    if (!/^\+?\d*$/.test(value)) {
      return;
    }
    onChangeOrderInput({
      ...orderInput,
      receiverPhone: value,
    });
  };

  handleChangeData = (addressFullData: AddressFullType): void => {
    const { onChangeOrderInput, orderInput } = this.props;
    onChangeOrderInput({
      ...orderInput,
      addressFull: addressFullData,
    });
  };

  handleOnChangeAddressType = () => {
    this.handleOnSelectAddress(this.state.selectedAddress);
    const { onChangeAddressType } = this.props;
    this.setState({ selectedAddress: null }, onChangeAddressType);
  };

  render() {
    const {
      me,
      isAddressSelect,
      isNewAddress,
      saveAsNewAddress,
      orderInput,
      onChangeSaveCheckbox,
    } = this.props;
    const { addressFull } = orderInput;
    const { addresses, selectedAddress } = this.state;

    return (
      <Container correct>
        <Row>
          <Col size={12} xl={6}>
            <div styleName="addressWrapper">
              <Row>
                <Col size={12}>
                  <div styleName="title">Delivery info</div>
                  <div styleName="receiverContainer">
                    <Input
                      fullWidth
                      id="receiverName"
                      label={
                        <span>
                          Receiver name <span styleName="red">*</span>
                        </span>
                      }
                      onChange={this.handleChangeReceiver}
                      value={orderInput.receiverName}
                      limit={50}
                    />
                  </div>
                  <div styleName="receiverContainer">
                    <Input
                      fullWidth
                      id="receiverPhone"
                      label={
                        <span>
                          Receiver phone <span styleName="red">*</span>
                        </span>
                      }
                      onChange={this.handleChangePhone}
                      value={orderInput.receiverPhone}
                      limit={50}
                    />
                  </div>
                  <div styleName="selectAddressContainer">
                    <RadioButton
                      id="existingAddressCheckbox"
                      label="choose your address"
                      isChecked={isAddressSelect}
                      onChange={this.handleOnChangeAddressType}
                    />
                    {isAddressSelect && (
                      <div styleName="selectWrapper">
                        <div>
                          <Select
                            label="Address"
                            items={addresses}
                            activeItem={selectedAddress}
                            onSelect={this.handleOnSelectAddress}
                            forForm
                            containerStyle={{ width: '26rem' }}
                            dataTest="selectExistingAddress"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </Col>
                <Col size={12} xlHidden>
                  {orderInput.addressFull.value && (
                    <AddressInfo
                      addressFull={orderInput.addressFull}
                      receiverName={
                        orderInput.receiverName ||
                        `${me.firstName} ${me.lastName}`
                      }
                      email={me.email}
                    />
                  )}
                </Col>
                <Col size={12} sm={9} md={8} xl={12}>
                  <div>
                    <RadioButton
                      id="newAddressCheckbox"
                      label="Or fill fields below and save as address"
                      isChecked={isNewAddress}
                      onChange={this.handleOnChangeAddressType}
                    />
                    {isNewAddress && (
                      <div styleName="formWrapper">
                        <AddressForm
                          isOpen
                          onChangeData={this.handleChangeData}
                          country={addressFull ? addressFull.country : null}
                          address={addressFull ? addressFull.value : null}
                          addressFull={addressFull}
                        />
                        <div styleName="saveAddressWrapper">
                          <Checkbox
                            id="saveAddressCheckbox"
                            label="Save as a new address"
                            isChecked={saveAsNewAddress}
                            onChange={onChangeSaveCheckbox}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
          <Col size={6} xlVisibleOnly>
            {addressToString(orderInput.addressFull) && (
              <div styleName="addressInfoContainer">
                <AddressInfo
                  addressFull={orderInput.addressFull}
                  receiverName={
                    orderInput.receiverName || `${me.firstName} ${me.lastName}`
                  }
                  email={me.email}
                />
              </div>
            )}
          </Col>
        </Row>
      </Container>
    );
  }
}

export default CheckoutContent;
