// @flow strict

import React, { PureComponent } from 'react';
import { join, length, take } from 'ramda';

import { Icon } from 'components/Icon';

import { formatPrice } from 'utils';

import type { SelectItemType } from 'types';

import { convertCountriesToArrLabels } from '../utils';

import type { FilledCompanyType } from '../types';

import './CompanyItem.scss';

type PropsType = {
  currency: SelectItemType,
  company: FilledCompanyType,
  onRemoveCompany: (company: FilledCompanyType) => void,
  onSetEditableItem: (company: FilledCompanyType) => void,
};

class CompanyItem extends PureComponent<PropsType> {
  render() {
    const {
      company,
      onRemoveCompany,
      onSetEditableItem,
      currency,
    } = this.props;
    const countriesLabels = convertCountriesToArrLabels(company.countries);
    const countriesText = join(', ', take(10, countriesLabels));
    const countriesLength = length(countriesLabels);
    const imgAlt = company.service ? company.service.label : '';
    return (
      <div styleName="container">
        <div styleName="logo">
          <img src={company.logo} alt={imgAlt} />
        </div>
        <div styleName="rest">
          <div styleName="info">
            <div styleName="td tdNamePrice">
              <div styleName="name">{imgAlt}</div>
              <div styleName="price">
                <div styleName="amount">{formatPrice(company.price)}</div>
                <div styleName="currency">{currency.label}</div>
              </div>
            </div>
            <div styleName="td tdCountry">
              <span styleName="text">
                {countriesText}
                {countriesLength > 10 && (
                  <span styleName="add">{` +${countriesLength - 10}`}</span>
                )}
              </span>

              {/* <StringLoadMore text={countriesText} /> */}
            </div>
          </div>
          <div styleName="controller">
            <button
              styleName="editButton"
              onClick={() => {
                onSetEditableItem(company);
              }}
            >
              <Icon type="note" size={32} />
            </button>
            <div styleName="deleteButton">
              <span
                onClick={() => {
                  onRemoveCompany(company);
                }}
                onKeyDown={() => {}}
                role="button"
                tabIndex="0"
              >
                <Icon type="basket" inline size={32} />
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CompanyItem;
