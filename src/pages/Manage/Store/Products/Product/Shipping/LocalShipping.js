// @flow

import React, { Component, Fragment } from 'react';
import classNames from 'classnames';
import { isEmpty, map, find, propEq } from 'ramda';

import { InputPrice, Checkbox, RadioButton } from 'components/common';

import { convertCurrenciesForSelect, findSelectedFromList } from 'utils';

import type { CurrenciesType, SelectType } from 'types';
import type { CompanyType } from './types';

import FixPriceForm from './FixPriceForm';
import CompanyItem from './CompanyItem';
import handlerShipping from './handlerShippingDecorator';

import './LocalShipping.scss';

const currenciesFromBack = [
  { key: 1, name: 'rouble', code: 'RUB' },
  { key: 2, name: 'euro', code: 'EUR' },
  { key: 3, name: 'dollar', code: 'USD' },
  { key: 4, name: 'bitcoin', code: 'BTC' },
  { key: 5, name: 'etherium', code: 'ETH' },
  { key: 6, name: 'stq', code: 'STQ' },
];

type StateType = {
  isCheckedOnlyPickup: boolean,
  isCheckedPickup: boolean,
  isCheckedFixPrice: boolean,
  pickupPrice: number,
  productCurrency: ?SelectType,
  pickupCurrency: ?SelectType,
};

type PropsType = {
  currencies: Array<CompanyType>,
  currencyId: number,
  inter?: boolean,
  companies: Array<CompanyType>,
  editableItemId: ?string,
  remainingServices: Array<SelectType>,
  possibleServices: Array<SelectType>,
  onSaveCompany: (company: CompanyType) => void,
  onRemoveCompany: (id: string) => void,
  onSetEditableItem: (id: string) => void,
  onRemoveEditableItem: () => void,
};

class LocalShipping extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    const { currencies, currencyId } = props;
    this.state = {
      isCheckedOnlyPickup: false,
      isCheckedPickup: false,
      isCheckedFixPrice: true,
      pickupPrice: 0,
      productCurrency: findSelectedFromList(
        convertCurrenciesForSelect(currenciesFromBack),
        currencyId,
      ),
      pickupCurrency: findSelectedFromList(
        convertCurrenciesForSelect(currenciesFromBack),
        currencyId,
      ),
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

  handleOnChangeCurrency = (pickupCurrency: SelectType) => {
    this.setState({ pickupCurrency });
  };

  render() {
    const {
      currencyId,
      companies,
      editableItemId,
      remainingServices,
      possibleServices,
      inter,
    } = this.props;
    const {
      isCheckedOnlyPickup,
      isCheckedPickup,
      isCheckedFixPrice,
      pickupPrice,
      pickupCurrency,
      productCurrency,
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
              inter={inter}
              productCurrency={productCurrency}
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
                          inter={inter}
                          services={possibleServices}
                          productCurrency={item.currency}
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
