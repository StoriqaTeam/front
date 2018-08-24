// @flow

import React, { PureComponent } from 'react';

import { head, prepend, find, propEq } from 'ramda';

import { Select } from 'components/common/Select';
import { InputPrice } from 'components/common';
import { Button } from 'components/common/Button';
import { Icon } from 'components/Icon';

import { convertCurrenciesForSelect, formatPrice } from 'utils';

import type { SelectType } from 'components/common/Select';

import './CompanyItem.scss';

type CompanyType = {
  id: string,
  img: string,
  service: SelectType,
  price: number,
  currencyId: number,
  currencyLabel: string,
};

type StateType = {};

type PropsType = {
  company: CompanyType,
  onRemoveCompany: (id: string) => void,
  onSetEditableItem: (id: string) => void,
};

class CompanyItem extends PureComponent<PropsType, StateType> {
  render() {
    console.log('---this.props.company', this.props.company);
    const { company, onRemoveCompany, onSetEditableItem } = this.props;
    return (
      <div styleName="container">
        <div styleName="logo">
          <img src={company.img} alt={company.service.label} />
        </div>
        <div styleName="rest">
          <div styleName="info">
            <div styleName="td tdName">{company.service.label}</div>
            <div styleName="td tdPrice">
              <div styleName="amount">{formatPrice(company.price)}</div>
              <div styleName="currency">{company.currencyLabel}</div>
            </div>
          </div>
          <div styleName="controller">
            <strong
              styleName="editButton"
              onClick={() => {
                onSetEditableItem(company.id);
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
                  onRemoveCompany(company.id);
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
