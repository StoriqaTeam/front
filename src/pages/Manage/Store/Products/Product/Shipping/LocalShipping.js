// @flow

import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { isEmpty, map, prepend, length, filter } from 'ramda';

import { AppContext } from 'components/App';
import { RadioButton } from 'components/common/RadioButton';
import { Checkbox } from 'components/common/Checkbox';

import FixPriceForm from './FixPriceForm';
import CompanyItem from './CompanyItem';

import './LocalShipping.scss';

type CompanyType = {
  id?: string,
  companyName: string,
  price: number,
  currencyId: number,
  currencyLabel: string,
};

type StateType = {
  isCheckedPickup: boolean,
  isCheckedFixPrice: boolean,
  companies: Array<CompanyType>,
};

type PropsType = {
  currencyId: number,
};

class LocalShipping extends PureComponent<PropsType, StateType> {
  state = {
    isCheckedPickup: false,
    isCheckedFixPrice: true,
    companies: [],
  };

  onAddCompany = (company: CompanyType) => {
    const img =
      company.companyName === 'Ups'
        ? 'https://s3.us-east-1.amazonaws.com/storiqa-dev/img-BJlKQe5H9p0C.png'
        : 'https://s3.us-east-1.amazonaws.com/storiqa-dev/img-zakbquXuoLUC.png';
    this.setState((prevState: StateType) => {
      const newCompany = {
        ...company,
        id: `${length(prevState.companies)}`,
        img,
      };
      return { companies: prepend(newCompany, prevState.companies) };
    });
  };

  onRemoveCompany = (id: string) => {
    this.setState((prevState: StateType) => ({
      companies: filter(item => id !== item.id, prevState.companies),
    }));
  };

  handleOnChangeCheckbox = (id: string) => {
    if (id === 'localShippingPickup') {
      this.setState((prevState: StateType) => ({
        isCheckedPickup: !prevState.isCheckedPickup,
      }));
    }
    if (id === 'localShippingFixPrice') {
      this.setState((prevState: StateType) => ({
        isCheckedFixPrice: !prevState.isCheckedFixPrice,
      }));
    }
  };

  render() {
    const { currencyId } = this.props;
    const { isCheckedPickup, isCheckedFixPrice, companies } = this.state;
    console.log('---companies', companies);
    return (
      <AppContext.Consumer>
        {({ directories }) => (
          <div styleName="container">
            <div styleName="title">
              <strong>Local shipping</strong>
            </div>
            <div styleName="radioButtons">
              <div styleName="radioButton">
                <Checkbox
                  id="localShippingPickup"
                  label="Pickup"
                  isChecked={isCheckedPickup}
                  onChange={this.handleOnChangeCheckbox}
                />
              </div>
              <div styleName="radioButton">
                <Checkbox
                  id="localShippingFixPrice"
                  label="Fixed, single price for all"
                  isChecked={isCheckedFixPrice}
                  onChange={this.handleOnChangeCheckbox}
                />
              </div>
            </div>
            <div styleName="form">
              <div
                styleName={classNames('hidePlane', { hide: isCheckedFixPrice })}
              />
              <FixPriceForm
                currencyId={currencyId}
                currencies={directories.currencies}
                onAddCompany={this.onAddCompany}
              />
              {!isEmpty(companies) && (
                <div styleName="companies">
                  {map(
                    item => (
                      <CompanyItem
                        key={item.id}
                        company={item}
                        onRemoveCompany={this.onRemoveCompany}
                      />
                    ),
                    companies,
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </AppContext.Consumer>
    );
  }
}

export default LocalShipping;
