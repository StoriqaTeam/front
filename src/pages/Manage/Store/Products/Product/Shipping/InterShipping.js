// @flow

import React, { Component, Fragment } from 'react';
import classNames from 'classnames';
import { isEmpty, map } from 'ramda';

import { RadioButton } from 'components/common/RadioButton';

import type { SelectItemType } from 'types';
import type {
  CompanyType,
  InterAvailablePackagesType,
  ShippingChangeDataType,
  FilledCompanyType,
  InterServiceType,
} from './types';

import FixPriceForm from './FixPriceForm';
import CompanyItem from './CompanyItem';
import handlerShipping from './handlerShippingDecorator';

import './InterShipping.scss';

type StateType = {
  isSelectedWithout: boolean,
  isSelectedFixPrice: boolean,
};

type PropsType = {
  // From Shipping Component
  currency: SelectItemType,
  interAvailablePackages: InterAvailablePackagesType,
  onChangeShippingData: (data: ShippingChangeDataType) => void,

  // From Shipping Decorator
  companies: Array<FilledCompanyType>,
  editableItemId: ?string,
  remainingServices: Array<InterServiceType>,
  possibleServices: Array<InterServiceType>,
  onSaveCompany: (company: CompanyType) => void,
  onRemoveCompany: (company: FilledCompanyType) => void,
  onSetEditableItem: (company: FilledCompanyType) => void,
  onRemoveEditableItem: () => void,
};

class InterShipping extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    const { interAvailablePackages } = props;

    this.state = {
      isSelectedWithout: isEmpty(interAvailablePackages),
      isSelectedFixPrice: !isEmpty(interAvailablePackages),
    };
  }

  handleOnChangeRadioButton = (id: string) => {
    if (isEmpty(this.props.interAvailablePackages)) {
      this.setState({
        isSelectedWithout: true,
        isSelectedFixPrice: false,
      });
      return;
    }
    this.setState(
      {
        isSelectedWithout: id === 'interShippingWithout',
        isSelectedFixPrice: id !== 'interShippingWithout',
      },
      () => {
        this.props.onChangeShippingData({
          inter: true,
          withoutInter: this.state.isSelectedWithout,
        });
      },
    );
  };

  render() {
    const {
      currency,
      companies,
      editableItemId,
      remainingServices,
      possibleServices,
      onSaveCompany,
      interAvailablePackages,
      onRemoveCompany,
      onSetEditableItem,
      onRemoveEditableItem,
    } = this.props;
    const { isSelectedWithout, isSelectedFixPrice } = this.state;

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
              isChecked={isSelectedWithout}
              onChange={this.handleOnChangeRadioButton}
            />
          </div>
          <div styleName="radioButton">
            <RadioButton
              inline
              id="interShippingFixPrice"
              label="Fixed, single price for all"
              isChecked={isSelectedFixPrice}
              onChange={this.handleOnChangeRadioButton}
            />
          </div>
        </div>
        <div styleName={classNames('form', { hidePlane: isSelectedWithout })}>
          <div
            styleName={classNames('formWrap', {
              hidePlane: isEmpty(remainingServices) && !isSelectedWithout,
            })}
          >
            <FixPriceForm
              inter
              currency={currency}
              services={remainingServices}
              onSaveCompany={onSaveCompany}
              interAvailablePackages={interAvailablePackages}
            />
          </div>
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
                          inter
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
      </div>
    );
  }
}

export default handlerShipping(InterShipping, true);
