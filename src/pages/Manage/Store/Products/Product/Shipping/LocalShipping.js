// @flow

import React, { Component, Fragment } from 'react';
import classNames from 'classnames';
import {
  isEmpty,
  map,
  prepend,
  length,
  filter,
  find,
  propEq,
  difference,
} from 'ramda';

import { AppContext } from 'components/App';
import { RadioButton } from 'components/common/RadioButton';
import { Checkbox } from 'components/common/Checkbox';

import FixPriceForm from './FixPriceForm';
import CompanyItem from './CompanyItem';

import type { SelectType } from 'components/common/Select';

import './LocalShipping.scss';

const services = [
  { id: 'ups', label: 'Ups' },
  { id: 'fedex', label: 'FedEx' },
  { id: 'post', label: 'Post of Russia' },
];

type CompanyType = {
  id?: string,
  service: SelectType,
  price: number,
  currencyId: number,
  currencyLabel: string,
};

type StateType = {
  isCheckedPickup: boolean,
  isCheckedFixPrice: boolean,
  companies: Array<CompanyType>,
  editableItemId: ?string,
  remainingServices: Array<SelectType>,
  possibleServices: Array<SelectType>,
};

type PropsType = {
  currencyId: number,
};

class LocalShipping extends Component<PropsType, StateType> {
  state = {
    isCheckedPickup: false,
    isCheckedFixPrice: true,
    companies: [],
    editableItemId: null,
    remainingServices: services,
    possibleServices: services,
  };

  onSaveCompany = (company: CompanyType) => {
    let img = '';
    switch (company.service.id) {
      case 'ups':
        img =
          'https://s3.us-east-1.amazonaws.com/storiqa-dev/img-BJlKQe5H9p0C.png';
        break;
      case 'fedex':
        img =
          'https://s3.us-east-1.amazonaws.com/storiqa-dev/img-zakbquXuoLUC.png';
        break;
      case 'post':
        img = 'https://s3.eu-west-2.amazonaws.com/storiqa/img-71Wnx40FWb8C.png';
        break;
      default:
        img = '';
    }
    if (company.id) {
      this.setState((prevState: StateType) => {
        const newCompanies = map(item => {
          if (item.id === company.id) {
            return { ...company, img };
          }
          return { ...item };
        }, prevState.companies);
        return {
          companies: newCompanies,
          remainingServices: this.differenceServices(newCompanies),
          editableItemId: null,
        };
      });
    } else {
      this.setState((prevState: StateType) => {
        const newCompany = {
          ...company,
          id: `${length(prevState.companies)}`,
          img,
        };
        const newCompanies = prepend(newCompany, prevState.companies);
        return {
          companies: newCompanies,
          remainingServices: this.differenceServices(newCompanies),
          editableItemId: null,
        };
      });
    }
  };

  onRemoveCompany = (id: string) => {
    this.setState((prevState: StateType) => {
      const newCompanies = filter(item => id !== item.id, prevState.companies);
      return {
        companies: newCompanies,
        remainingServices: this.differenceServices(newCompanies),
        editableItemId: null,
      };
    });
  };

  differenceServices = (companies: Array<CompanyType>) =>
    difference(services, map(item => item.service, companies));

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

  onSetEditableItem = (id: string) => {
    this.setState((prevState: StateType) => {
      const { companies } = prevState;
      const thisCompany = find(propEq('id', id))(companies);
      const differenceArr = difference(
        services,
        map(item => item.service, companies),
      );
      return {
        editableItemId: id,
        // $FlowIgnore
        possibleServices: prepend(thisCompany.service, differenceArr),
      };
    });
  };

  onRemoveEditableItem = () => {
    this.setState({ editableItemId: null });
  };

  render() {
    const { currencyId } = this.props;
    const {
      isCheckedPickup,
      isCheckedFixPrice,
      companies,
      editableItemId,
      remainingServices,
      possibleServices,
    } = this.state;
    console.log('---remainingServices', remainingServices);
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
            <div
              styleName={classNames('form', { hidePlane: !isCheckedFixPrice })}
            >
              <div
                styleName={classNames('formWrap', {
                  hidePlane: isEmpty(remainingServices),
                })}
              >
                <FixPriceForm
                  currencyId={currencyId}
                  services={remainingServices}
                  onSaveCompany={this.onSaveCompany}
                />
              </div>
              {!isEmpty(companies) && (
                <div styleName="companies">
                  {map(
                    item => (
                      <Fragment key={item.id}>
                        {console.log('---item', item)}
                        <CompanyItem
                          company={item}
                          onRemoveCompany={this.onRemoveCompany}
                          onSetEditableItem={this.onSetEditableItem}
                        />
                        {editableItemId === item.id && (
                          <div styleName="editableForm">
                            <FixPriceForm
                              services={possibleServices}
                              currencyId={currencyId}
                              company={{
                                id: item.id,
                                price: item.price,
                                currencyId: item.currencyId,
                                service: item.service,
                              }}
                              onSaveCompany={this.onSaveCompany}
                              onRemoveEditableItem={this.onRemoveEditableItem}
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
        )}
      </AppContext.Consumer>
    );
  }
}

export default LocalShipping;
