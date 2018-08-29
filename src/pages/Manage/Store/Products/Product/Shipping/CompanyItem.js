// @flow

import React, { PureComponent } from 'react';

import { head, prepend, find, propEq } from 'ramda';

import { Select } from 'components/common/Select';
import { InputPrice } from 'components/common';
import { Button } from 'components/common/Button';
import { Icon } from 'components/Icon';

import { formatPrice } from 'utils';

// import type { SelectType } from 'types';
import type { CompanyType } from './types';

import './CompanyItem.scss';

type StateType = {};

type PropsType = {
  company: CompanyType,
  onRemoveCompany: (id: string) => void,
  onSetEditableItem: (id: string) => void,
};

class CompanyItem extends PureComponent<PropsType, StateType> {
  render() {
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
              <div styleName="currency">{company.currency.label}</div>
            </div>
            <div styleName="td tdCountry">
              {company.country ? company.country.label : ''}
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
