// @flow

import React, { Component, Fragment } from 'react';
import classNames from 'classnames';
import { isEmpty, map } from 'ramda';

import { InputPrice, Checkbox, RadioButton } from 'components/common';

import type { SelectItemType } from 'types';
import type {
  ServicesType,
  CompanyType,
  LocalShippingType,
  PickupShippingType,
} from './types';

import FixPriceForm from './FixPriceForm';
import CompanyItem from './CompanyItem';
import handlerShipping from './handlerShippingDecorator';

import './LocalShipping.scss';

type StateType = {
  isCheckedPickup: boolean,
  pickupPrice: number,
  pickupCurrency: SelectItemType,
  isCheckedWithout: boolean,
  isCheckedFixPrice: boolean,
};

type PropsType = {
  currency: SelectItemType,
  localShipping: LocalShippingType,
  pickupShipping: PickupShippingType,

  companies: Array<CompanyType>,
  editableItemId: ?string,
  remainingServices: ServicesType,
  possibleServices: ServicesType,
  onSaveCompany: (company: CompanyType) => void,
  onRemoveCompany: (company: CompanyType) => void,
  onSetEditableItem: (company: CompanyType) => void,
  onRemoveEditableItem: () => void,
  globalOnChange: (data: {
    pickup?: any,
  }) => void,
  localAvailablePackages: any,
};

class LocalShipping extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    console.log('---props', props);
    const { pickupShipping, currency, globalOnChange } = props;
    const isCheckedPickup = Boolean(pickupShipping && pickupShipping.pickup);

    globalOnChange({
      pickup: {
        pickup: Boolean(pickupShipping && pickupShipping.pickup),
        price: (pickupShipping && pickupShipping.price) || 0,
      },
    });

    this.state = {
      isCheckedPickup,
      pickupPrice: (pickupShipping && pickupShipping.price) || 0,
      pickupCurrency: currency,
      isCheckedWithout: false,
      isCheckedFixPrice: true,
    };
  }

  handleOnChangeRadioButton = (id: string) => {
    this.setState(
      {
        isCheckedWithout: id === 'withoutLocalShipping',
        isCheckedFixPrice: id !== 'withoutLocalShipping',
      },
      () => {
        this.props.globalOnChange({
          inter: true,
          withoutLocal: this.state.isCheckedWithout,
        });
      },
    );
  };

  handleOnTogglePickup = () => {
    this.setState(
      (prevState: StateType) => ({
        isCheckedPickup: !prevState.isCheckedPickup,
      }),
      this.handleGlobalOnChange,
    );
  };

  handleOnChangePickupPrice = (pickupPrice: number) => {
    this.setState({ pickupPrice }, this.handleGlobalOnChange);
  };

  handleGlobalOnChange = () => {
    this.props.globalOnChange({
      pickup: {
        pickup: this.state.isCheckedPickup,
        price: this.state.pickupPrice,
      },
    });
  };

  // handleOnChangeCurrency = (pickupCurrency: SelectItemType) => {
  //   this.setState({ pickupCurrency });
  // };

  render() {
    const {
      currency,
      companies,
      editableItemId,
      remainingServices,
      possibleServices,
    } = this.props;
    const {
      isCheckedPickup,
      pickupPrice,
      pickupCurrency,
      isCheckedWithout,
      isCheckedFixPrice,
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
              isChecked={isCheckedWithout}
              onChange={this.handleOnChangeRadioButton}
            />
          </div>
          <div styleName="checkBox">
            <RadioButton
              inline
              id="localShippingFixPrice"
              label="Fixed, single price for all"
              isChecked={isCheckedFixPrice}
              onChange={this.handleOnChangeRadioButton}
            />
          </div>
        </div>
        <div
          styleName={classNames('form', {
            hidePlane: isCheckedWithout,
          })}
        >
          <div styleName="pickup">
            <div styleName="pickupCheckbox">
              <Checkbox
                inline
                id="localPickupCheckbox"
                label="Pickup"
                isChecked={isCheckedPickup}
                onChange={this.handleOnTogglePickup}
              />
            </div>
            <div styleName="pickupPriceInput">
              <InputPrice
                onChangePrice={this.handleOnChangePickupPrice}
                price={pickupPrice}
                currency={pickupCurrency}
              />
            </div>
          </div>
          <div
            styleName={classNames('formWrap', {
              hidePlane: isEmpty(remainingServices) && !isCheckedWithout,
            })}
          >
            <FixPriceForm
              currency={currency}
              services={remainingServices}
              onSaveCompany={this.props.onSaveCompany}
            />
          </div>
          {!isEmpty(companies) && (
            <div styleName="companies">
              {map(
                item => (
                  <Fragment key={item.id}>
                    <CompanyItem
                      company={item}
                      onRemoveCompany={this.props.onRemoveCompany}
                      onSetEditableItem={this.props.onSetEditableItem}
                    />
                    {editableItemId === item.id && (
                      <div styleName="editableForm">
                        <FixPriceForm
                          services={possibleServices}
                          currency={item.currency}
                          company={item}
                          onSaveCompany={this.props.onSaveCompany}
                          onRemoveEditableItem={this.props.onRemoveEditableItem}
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
      </div>
    );
  }
}

export default handlerShipping(LocalShipping);
