// @flow

import React, { Component, Fragment } from 'react';
import classNames from 'classnames';
import { isEmpty, map } from 'ramda';

import { AppContext } from 'components/App';
import { RadioButton } from 'components/common/RadioButton';

import { convertCurrenciesForSelect, findSelectedFromList } from 'utils';

import type { SelectType } from 'types';
import type { CompanyType } from './types';

import FixPriceForm from './FixPriceForm';
import CompanyItem from './CompanyItem';
import handlerShipping from './handlerShippingDecorator';

import './InterShipping.scss';

const currenciesFromBack = [
  { key: 1, name: 'rouble', code: 'RUB' },
  { key: 2, name: 'euro', code: 'EUR' },
  { key: 3, name: 'dollar', code: 'USD' },
  { key: 4, name: 'bitcoin', code: 'BTC' },
  { key: 5, name: 'etherium', code: 'ETH' },
  { key: 6, name: 'stq', code: 'STQ' },
];

const countries = [
  { id: 'all', label: 'All countries' },
  { id: 'us', label: 'United States' },
  { id: 'ru', label: 'Russian Federation' },
];

const interServices: Array<SelectType> = [
  {
    id: 'ups',
    label: 'Ups',
    countries: [
      { id: 'all', label: 'All countries' },
      { id: 'rw', label: 'Rwanda' },
      { id: 'sm', label: 'San Marino' },
      { id: 'gf', label: 'French Guiana' },
      { id: 'il', label: 'Israel' },
    ],
  },
  {
    id: 'fedex',
    label: 'FedEx',
    countries: [
      { id: 'all', label: 'All countries' },
      { id: 'rs', label: 'Serbia' },
      { id: 'tk', label: 'Tokelau' },
      { id: 'ye', label: 'Yemen' },
    ],
  },
  {
    id: 'post',
    label: 'Post of Russia',
    countries: [
      { id: 'all', label: 'All countries' },
      { id: 'us', label: 'United States' },
      { id: 'ru', label: 'Russian Federation' },
    ],
  },
];

type StateType = {
  isCheckedWithout: boolean,
  isCheckedFixPrice: boolean,
  productCurrency: ?SelectType,
};

type PropsType = {
  currencyId: number,
  inter?: boolean,
  companies: Array<CompanyType>,
  editableItemId: ?string,
  remainingServices: Array<SelectType>,
  remainingCountries: Array<SelectType>,
  possibleServices: Array<SelectType>,
  possibleCountries: Array<SelectType>,
  onSaveCompany: (company: CompanyType) => void,
  onRemoveCompany: (id: string) => void,
  onSetEditableItem: (id: string) => void,
  onRemoveEditableItem: () => void,
  interServices: any,
};

class InterShipping extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    const { currencies, currencyId } = props;
    this.state = {
      isCheckedWithout: false,
      isCheckedFixPrice: true,
      productCurrency: findSelectedFromList(
        convertCurrenciesForSelect(currenciesFromBack),
        currencyId,
      ),
    };
  }

  handleOnChangeRadioButton = (id: string) => {
    this.setState({
      isCheckedWithout: id === 'interShippingWithout',
      isCheckedFixPrice: id !== 'interShippingWithout',
    });
  };

  render() {
    const {
      currencyId,
      companies,
      editableItemId,
      remainingServices,
      possibleServices,
      remainingCountries,
      inter,
      interServices,
      countries,
      servicesWithCountries,
      possibleCountries,
      possibleServicesWithCountries,
    } = this.props;
    const { isCheckedWithout, isCheckedFixPrice, productCurrency } = this.state;

    return (
      <div styleName="container">
        <div styleName="title">
          <strong>International shipping</strong>
        </div>
        <div styleName="radioButtons">
          <div styleName="radioButton">
            <RadioButton
              inline
              id="interShippingWithout"
              label="Without international delivery"
              isChecked={isCheckedWithout}
              onChange={this.handleOnChangeRadioButton}
            />
          </div>
          <div styleName="radioButton">
            <RadioButton
              inline
              id="interShippingFixPrice"
              label="Fixed, single price for all"
              isChecked={isCheckedFixPrice}
              onChange={this.handleOnChangeRadioButton}
            />
          </div>
        </div>
        <div styleName={classNames('form', { hidePlane: !isCheckedFixPrice })}>
          <div
            styleName={classNames('formWrap', {
              hidePlane: isEmpty(remainingServices),
            })}
          >
            <FixPriceForm
              inter={inter}
              servicesWithCountries={servicesWithCountries}
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
                          possibleCountries={possibleCountries}
                          productCurrency={item.currency}
                          servicesWithCountries={possibleServicesWithCountries}
                          company={{
                            id: item.id,
                            price: item.price,
                            currency: item.currency,
                            service: item.service,
                            country: item.country,
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

export default handlerShipping(InterShipping, true);
