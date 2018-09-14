// @flow

import React, { Component, Fragment } from 'react';
import classNames from 'classnames';
import { isEmpty, map } from 'ramda';

import { InputPrice, Checkbox, RadioButton } from 'components/common';

import type { SelectItemType } from 'types';
import type {
  ServicesType,
  CompanyType,
  LocalShippigType,
  PickupShippigType,
} from './types';

import FixPriceForm from './FixPriceForm';
import CompanyItem from './CompanyItem';
import handlerShipping from './handlerShippingDecorator';

import './LocalShipping.scss';

type StateType = {
  isCheckedOnlyPickup: boolean,
  isCheckedPickup: boolean,
  isCheckedFixPrice: boolean,
  pickupPrice: number,
  pickupCurrency: SelectItemType,
};

type PropsType = {
  currency: SelectItemType,
  localShippig: LocalShippigType,
  pickupShippig: PickupShippigType,

  companies: Array<CompanyType>,
  editableItemId: ?string,
  remainingServices: ServicesType,
  possibleServices: ServicesType,
  onSaveCompany: (company: CompanyType) => void,
  onRemoveCompany: (company: CompanyType) => void,
  onSetEditableItem: (company: CompanyType) => void,
  onRemoveEditableItem: () => void,
};

class LocalShipping extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      isCheckedOnlyPickup: false,
      isCheckedPickup: false,
      isCheckedFixPrice: true,
      pickupPrice: 0,
      pickupCurrency: props.currency,
    };
  }

  handleOnChangeRadioButton = (id: string) => {
    this.setState({
      isCheckedOnlyPickup: id === 'localShippingPickup',
      isCheckedFixPrice: id !== 'localShippingPickup',
    });
  };

  handleOnTogglePickup = () => {
    this.setState((prevState: StateType) => ({
      isCheckedPickup: !prevState.isCheckedPickup,
    }));
  };

  handleOnChangePickupPrice = (pickupPrice: number) => {
    this.setState({ pickupPrice });
  };

  handleOnChangeCurrency = (pickupCurrency: SelectItemType) => {
    this.setState({ pickupCurrency });
  };

  render() {
    const {
      currency,
      companies,
      editableItemId,
      remainingServices,
      possibleServices,
    } = this.props;
    const {
      isCheckedOnlyPickup,
      isCheckedPickup,
      isCheckedFixPrice,
      pickupPrice,
      pickupCurrency,
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
              id="localShippingPickup"
              label="Only pickup"
              isChecked={isCheckedOnlyPickup}
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
        <div styleName={classNames('form', { hidePlane: !isCheckedFixPrice })}>
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
                onChangeCurrency={this.handleOnChangeCurrency}
                price={pickupPrice}
                currency={pickupCurrency}
              />
            </div>
          </div>
          <div
            styleName={classNames('formWrap', {
              hidePlane: isEmpty(remainingServices),
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
                          company={{
                            id: item.id,
                            price: item.price,
                            currency: item.currency,
                            service: item.service,
                          }}
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
