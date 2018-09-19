// @flow

import React, { PureComponent } from 'react';

import { Icon } from 'components/Icon';
import { StringLoadMore } from 'components/StringLoadMore';

import { formatPrice } from 'utils';
import { convertCountriesToStringLabels } from './utils';

import type { FilledCompanyType } from './types';

import './CompanyItem.scss';

type PropsType = {
  company: FilledCompanyType,
  onRemoveCompany: (company: FilledCompanyType) => void,
  onSetEditableItem: (company: FilledCompanyType) => void,
};

class CompanyItem extends PureComponent<PropsType> {
  render() {
    const { company, onRemoveCompany, onSetEditableItem } = this.props;
    const countriesText =
      company && company.countries
        ? convertCountriesToStringLabels(company.countries)
        : '';
    const imgAlt = company.service ? company.service.label : '';
    return (
      <div styleName="container">
        <div styleName="logo">
          <img src={company.logo} alt={imgAlt} />
        </div>
        <div styleName="rest">
          <div styleName="info">
            <div styleName="td tdName">{imgAlt}</div>
            <div styleName="td tdPrice">
              <div styleName="amount">{formatPrice(company.price)}</div>
              <div styleName="currency">{company.currency.label}</div>
            </div>
            <div styleName="td tdCountry">
              <StringLoadMore text={countriesText} />
            </div>
          </div>
          <div styleName="controller">
            <strong
              styleName="editButton"
              onClick={() => {
                onSetEditableItem(company);
              }}
              onKeyDown={() => {}}
              role="button"
              tabIndex="0"
            >
              Edit
            </strong>
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
