// @flow strict

import React, { Component, Fragment } from 'react';
import classNames from 'classnames';
import { isEmpty, map } from 'ramda';

import { RadioButton } from 'components/common/RadioButton';

import type { SelectItemType } from 'types';
import type {
  CompanyType,
  InterAvailablePackageType,
  ShippingChangeDataType,
  FilledCompanyType,
  InterServiceType,
  ShippingType,
} from '../types';

import FixPriceForm from '../FixPriceForm';
import CompanyItem from '../CompanyItem';
import handlerShipping from '../handlerInterShippingDecorator';

import './InterShipping.scss';

import t from './i18n';

type StateType = {
  isSelectedWithout: boolean,
  isSelectedFixPrice: boolean,
};

type PropsType = {
  // From Shipping Component
  currency: SelectItemType,
  interShipping: ShippingType,
  interAvailablePackages: InterAvailablePackageType,
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

  error: string,
};

class InterShipping extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    const { interAvailablePackages, interShipping } = props;
    const isSelectedWithout =
      !interAvailablePackages ||
      isEmpty(interAvailablePackages) ||
      isEmpty(interShipping);

    this.state = {
      isSelectedWithout,
      isSelectedFixPrice: !isSelectedWithout,
    };
  }

  handleOnChangeRadioButton = (id: string) => {
    const { interAvailablePackages } = this.props;
    if (!interAvailablePackages || isEmpty(interAvailablePackages)) {
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
      companies,
      editableItemId,
      remainingServices,
      possibleServices,
      onSaveCompany,
      interAvailablePackages,
      onRemoveCompany,
      onSetEditableItem,
      onRemoveEditableItem,
      error,
      currency,
    } = this.props;
    const { isSelectedWithout, isSelectedFixPrice } = this.state;

    return (
      <div styleName="container">
        <div styleName="title">
          <strong>{t.internationalShipping}</strong>
        </div>
        <div styleName="radioButtons">
          <div styleName="radioButton">
            <RadioButton
              inline
              id="interShippingWithout"
              label={t.withoutInternationalDelivery}
              isChecked={isSelectedWithout}
              onChange={this.handleOnChangeRadioButton}
            />
          </div>
          {interAvailablePackages &&
            !isEmpty(interAvailablePackages) && (
              <div styleName="radioButton">
                <RadioButton
                  inline
                  id="interShippingFixPrice"
                  label={t.fixedSinglePriceForAll}
                  isChecked={isSelectedFixPrice}
                  onChange={this.handleOnChangeRadioButton}
                />
              </div>
            )}
        </div>
        <div styleName={classNames('form', { hidePlane: isSelectedWithout })}>
          <div
            styleName={classNames('formWrap', {
              coverPlane: isEmpty(remainingServices) && !isSelectedWithout,
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
                      currency={currency}
                      company={item}
                      onRemoveCompany={onRemoveCompany}
                      onSetEditableItem={onSetEditableItem}
                    />
                    {editableItemId === item.id && (
                      <div styleName="editableForm">
                        <FixPriceForm
                          inter
                          currency={currency}
                          services={possibleServices}
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
        {!interAvailablePackages ||
          (isEmpty(interAvailablePackages) && (
            <div styleName="emptyPackegesText">{t.noAvailablePackages}</div>
          ))}
        <div
          id="interShippingError"
          styleName={classNames('error', {
            show: interAvailablePackages && error,
          })}
        >
          {error}
        </div>
      </div>
    );
  }
}

export default handlerShipping(InterShipping);
