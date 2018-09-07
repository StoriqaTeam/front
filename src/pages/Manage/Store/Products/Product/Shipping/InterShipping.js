// @flow

import React, { Component, Fragment } from 'react';
import classNames from 'classnames';
import { isEmpty, map } from 'ramda';

import { RadioButton } from 'components/common/RadioButton';

import type { SelectItemType } from 'types';
import type { CompanyType, CompaniesInterType, ServicesType } from './types';

import FixPriceForm from './FixPriceForm';
import CompanyItem from './CompanyItem';
import handlerShipping from './handlerShippingDecorator';

import './InterShipping.scss';

type StateType = {
  isCheckedWithout: boolean,
  isCheckedFixPrice: boolean,
};

type PropsType = {
  currency: SelectItemType,
  companies: CompaniesInterType,
  editableItemId: ?string,
  remainingServices: ServicesType,
  possibleServices: ServicesType,
  onSaveCompany: (company: CompanyType) => void,
  onRemoveCompany: (company: CompanyType) => void,
  onSetEditableItem: (company: CompanyType) => void,
  onRemoveEditableItem: () => void,
};

class InterShipping extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      isCheckedWithout: false,
      isCheckedFixPrice: true,
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
      currency,
      companies,
      editableItemId,
      remainingServices,
      possibleServices,
    } = this.props;
    const { isCheckedWithout, isCheckedFixPrice } = this.state;

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
              inter
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
                          inter
                          services={possibleServices}
                          currency={item.currency}
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
