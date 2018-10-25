// @flow

import React from 'react';

import { Checkbox } from 'components/common/Checkbox';
import { RadioButton } from 'components/common/RadioButton';
import { Select } from 'components/common/Select';
import { Input } from 'components/common/Input';
import { Container, Row, Col } from 'layout';
import { AddressForm } from 'components/AddressAutocomplete';

import type { AddressFullType } from 'components/AddressAutocomplete/AddressForm';

import { addressToString } from 'utils';

import { addressesToSelect } from '../../utils';

import AddressInfo from '../AddressInfo';

import './CheckoutAddress.scss';

import t from './i18n';

type PropsType = {
  deliveryAddresses: any,
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

class CheckoutAddress extends React.Component<PropsType, StateType> {
  static getDerivedStateFromProps(nextProps: PropsType, prevState: StateType) {
    if (
      nextProps.deliveryAddresses &&
      nextProps.deliveryAddresses.length !== prevState.addresses.length
    ) {
      return {
        ...prevState,
        addresses: addressesToSelect(nextProps.deliveryAddresses),
      };
    }
    return prevState;
  }

  state = {
    addresses: [],
    selectedAddress: null,
  };

  handleOnSelectAddress = (item: any) => {
    const { onChangeOrderInput, orderInput, deliveryAddresses } = this.props;
    this.setState({ selectedAddress: item });
    const addressFull = deliveryAddresses[item.id].address;
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
    const { onChangeAddressType } = this.props;
    this.setState({ selectedAddress: null });
    onChangeAddressType();
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

    const { addresses: items, selectedAddress } = this.state;

    return (
      <Container correct>
        <Row>
          <Col size={12} xl={6}>
            <div styleName="addressWrapper">
              <Row>
                <Col size={12}>
                  <div styleName="title">{t.deliveryInfo}</div>
                  <div styleName="receiverContainer">
                    <Input
                      fullWidth
                      id="receiverName"
                      label={
                        <span>
                          {t.labelReceiverName} <span styleName="red">*</span>
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
                          {t.labelReceiverPhone}
                          <span styleName="red">*</span>
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
                      label={t.labelChooseYourAddress}
                      isChecked={isAddressSelect}
                      onChange={this.handleOnChangeAddressType}
                    />
                    {isAddressSelect && (
                      <div styleName="selectWrapper">
                        <div>
                          <Select
                            label={t.labelAddress}
                            items={items}
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
                      label={t.labelOrFillFields}
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
                            label={t.labelSaveAsNewAddress}
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

export default CheckoutAddress;