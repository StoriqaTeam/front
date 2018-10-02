// @flow strict

import React, { Component, Fragment } from 'react';
import classNames from 'classnames';
import { isEmpty, map } from 'ramda';

import { InputPrice, Checkbox, RadioButton } from 'components/common';

import type { SelectItemType } from 'types';
import type {
  PickupShippingType,
  ShippingChangeDataType,
  FilledCompanyType,
  ServiceType,
  CompanyType,
  AvailablePackageType,
} from './types';

import FixPriceForm from './FixPriceForm';
import CompanyItem from './CompanyItem';
import handlerShipping from './handlerLocalShippingDecorator';

import './LocalShipping.scss';

type StateType = {
  isSelectedPickup: boolean,
  pickupPrice: number,
  pickupCurrency: SelectItemType,
  isSelectedWithout: boolean,
  isSelectedFixPrice: boolean,
};

type PropsType = {
  // From Shipping Component
  currency: SelectItemType,
  pickupShipping: PickupShippingType,
  onChangeShippingData: (data: ShippingChangeDataType) => void,

  // From Shipping Decorator
  companies: Array<FilledCompanyType>,
  editableItemId: ?string,
  remainingServices: Array<ServiceType>,
  possibleServices: Array<ServiceType>,
  onSaveCompany: (company: CompanyType) => void,
  onRemoveCompany: (company: FilledCompanyType) => void,
  onSetEditableItem: (company: FilledCompanyType) => void,
  onRemoveEditableItem: () => void,

  localAvailablePackages: Array<AvailablePackageType>,
  error: string,
};

class LocalShipping extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    const { pickupShipping, currency, onChangeShippingData, companies } = props;
    const isSelectedPickup = Boolean(pickupShipping && pickupShipping.pickup);
    const isSelectedWithout = isEmpty(companies) && !isSelectedPickup;

    onChangeShippingData({
      pickup: {
        pickup: Boolean(pickupShipping && pickupShipping.pickup),
        price: (pickupShipping && pickupShipping.price) || 0,
      },
    });

    this.state = {
      isSelectedPickup,
      pickupPrice: (pickupShipping && pickupShipping.price) || 0,
      pickupCurrency: currency,
      isSelectedWithout,
      isSelectedFixPrice: !isSelectedWithout,
    };
  }

  handleOnChangeRadioButton = (id: string) => {
    this.setState(
      {
        isSelectedWithout: id === 'withoutLocalShipping',
        isSelectedFixPrice: id !== 'withoutLocalShipping',
      },
      () => {
        this.props.onChangeShippingData({
          inter: true,
          withoutLocal: this.state.isSelectedWithout,
        });
      },
    );
  };

  handleOnTogglePickup = () => {
    this.setState(
      (prevState: StateType) => ({
        isSelectedPickup: !prevState.isSelectedPickup,
      }),
      this.handleGlobalOnChange,
    );
  };

  handleOnChangePickupPrice = (pickupPrice: number) => {
    this.setState({ pickupPrice }, this.handleGlobalOnChange);
  };

  handleGlobalOnChange = () => {
    this.props.onChangeShippingData({
      pickup: {
        pickup: this.state.isSelectedPickup,
        price: this.state.pickupPrice,
      },
    });
  };

  render() {
    const {
      currency,
      companies,
      editableItemId,
      remainingServices,
      possibleServices,
      onSaveCompany,
      onRemoveCompany,
      onSetEditableItem,
      onRemoveEditableItem,
      localAvailablePackages,
      error,
    } = this.props;
    const {
      isSelectedPickup,
      pickupPrice,
      pickupCurrency,
      isSelectedWithout,
      isSelectedFixPrice,
    } = this.state;
    return (
      <div styleName="container">
        <div styleName="title">
          <strong>Local shipping</strong>
        </div>
        <div styleName="checkBoxes">
          <div styleName="checkBox">
            <RadioButton
              inline
              id="withoutLocalShipping"
              label="Without local delivery"
              isChecked={isSelectedWithout}
              onChange={this.handleOnChangeRadioButton}
            />
          </div>
          <div styleName="checkBox">
            <RadioButton
              inline
              id="localShippingFixPrice"
              label="Fixed, single price for all"
              isChecked={isSelectedFixPrice}
              onChange={this.handleOnChangeRadioButton}
            />
          </div>
        </div>
        <div styleName={classNames('form', { hidePlane: isSelectedWithout })}>
          <div styleName="pickup">
            <div styleName="pickupCheckbox">
              <Checkbox
                inline
                id="localPickupCheckbox"
                label="Pickup"
                isChecked={isSelectedPickup}
                onChange={this.handleOnTogglePickup}
              />
            </div>
            <div styleName="pickupPriceInput">
              <InputPrice
                onChangePrice={this.handleOnChangePickupPrice}
                price={pickupPrice}
                currency={pickupCurrency}
                dataTest="shippingPickupPrice"
              />
            </div>
          </div>
          {localAvailablePackages &&
            !isEmpty(localAvailablePackages) && (
              <div
                styleName={classNames('formWrap', {
                  coverPlane: isEmpty(remainingServices) && !isSelectedWithout,
                })}
              >
                <FixPriceForm
                  currency={currency}
                  services={remainingServices}
                  onSaveCompany={onSaveCompany}
                />
              </div>
            )}
          {!isEmpty(companies) && (
            <div styleName="companies">
              {map(
                item => (
                  <Fragment key={item.id}>
                    <CompanyItem
                      company={item}
                      onRemoveCompany={onRemoveCompany}
                      onSetEditableItem={onSetEditableItem}
                    />
                    {editableItemId === item.id && (
                      <div styleName="editableForm">
                        <FixPriceForm
                          services={possibleServices}
                          currency={item.currency}
                          company={item}
                          onSaveCompany={onSaveCompany}
                          onRemoveEditableItem={onRemoveEditableItem}
                        />
                      </div>
                    )}
                  </Fragment>
                ),
                companies,
              )}
            </div>
          )}
        </div>
        {!localAvailablePackages ||
          (isEmpty(localAvailablePackages) && (
            <div styleName="emptyPackegesText">No available packages</div>
          ))}
        {localAvailablePackages &&
          error && <div styleName="error">{error}</div>}
      </div>
    );
  }
}

export default handlerShipping(LocalShipping);
