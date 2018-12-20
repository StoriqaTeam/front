// @flow strict

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  head,
  pathOr,
  find,
  propEq,
  map,
  isEmpty,
  isNil,
  length,
  whereEq,
} from 'ramda';
import classname from 'classnames';

import { Select, SpinnerCircle } from 'components/common';
import { log, getCookie } from 'utils';
import { fetchAvailableShippingForUser } from 'relay/queries';

import type { SelectItemType, CountryType } from 'types';
import type { DeliveryAddress, DeliveryDataType, PackageType } from '../types';

import CheckedIcon from './img/checked.svg';
import './Delivery.scss';

type StateType = {
  isFetching: boolean,
  country: ?SelectItemType,
  deliveryPackages: ?Array<PackageType>,
  deliveryPackage: ?PackageType,
};

type PropsType = {
  userAddress: ?DeliveryAddress,
  baseProductRawId: number,
  countries: Array<CountryType>,
  onChangeDeliveryData: (deliveryData: DeliveryDataType) => void,
  deliveryData: DeliveryDataType,
};

class Delivery extends Component<PropsType, StateType> {
  state = {
    isFetching: false,
    country: null,
    deliveryPackage: null,
    deliveryPackages: null,
  };

  fetchData = () => {
    const { baseProductRawId } = this.props;
    // $FlowIgnore
    const countryCode = pathOr(
      null,
      ['address', 'countryCode'],
      this.props.userAddress,
    );

    if (countryCode) {
      // $FlowIgnore
      this.fetchAvailableShipping(baseProductRawId, countryCode);
    } else {
      const cookiesCountry = getCookie('COUNTRY_IP');
      const country = find(propEq('alpha2', cookiesCountry))(
        this.props.countries,
      );
      if (country) {
        this.fetchAvailableShipping(baseProductRawId, country.alpha3);
      }
    }
  };

  fetchAvailableShipping = (baseProductRawId: number, countryCode: string) => {
    fetchAvailableShippingForUser({
      destinationCountry: countryCode,
      baseProductId: baseProductRawId,
      environment: this.context.environment,
    })
      .then(deliveryPackages => {
        const country = find(propEq('alpha3', countryCode))(
          this.props.countries,
        );
        let deliveryPackage = null;
        if (deliveryPackages && length(deliveryPackages) === 1) {
          deliveryPackage = head(deliveryPackages);
        }
        this.setState({
          deliveryPackages,
          deliveryPackage,
          country: country
            ? { id: country.alpha3, label: country.label }
            : null,
        });
        return true;
      })
      .finally(() => {
        this.setState({ isFetching: false });
      })
      .catch(error => {
        log.error(error);
      });
  };

  handleOpenModal = () => {
    if (this.state.country) {
      return;
    }
    const { deliveryData } = this.props;
    if (!deliveryData.country) {
      this.fetchData();
    } else {
      this.setState({
        country: deliveryData.country,
        deliveryPackage: deliveryData.deliveryPackage,
        deliveryPackages: deliveryData.deliveryPackages,
      });
    }
  };

  handleOnChangeCountry = (country: ?SelectItemType) => {
    if (JSON.stringify(country) === JSON.stringify(this.state.country)) {
      return;
    }

    this.setState(
      {
        country,
        deliveryPackage: null,
      },
      () => {
        if (country) {
          this.setState({ isFetching: true });
          const { baseProductRawId } = this.props;
          this.fetchAvailableShipping(baseProductRawId, country.id);
          return;
        }
        this.setState({
          deliveryPackage: null,
          deliveryPackages: null,
        });
      },
    );
  };

  handleOnSelectPackage = (deliveryPackage: PackageType) => {
    this.setState({
      deliveryPackage,
    });
  };

  handleOnSavePackage = () => {
    this.props.onChangeDeliveryData({
      deliveryPackage: this.state.deliveryPackage,
      country: this.state.country,
      deliveryPackages: this.state.deliveryPackages || [],
    });
  };

  render() {
    log.debug(this.state);

    const {
      country,
      deliveryPackage,
      deliveryPackages,
      isFetching,
    } = this.state;
    const countries = map(
      item => ({ id: item.alpha3, label: item.label }),
      this.props.countries,
    );
    const transportCompanies = map(
      (item: PackageType) => ({
        id: `${item.companyPackageRawId}`,
        label: item.name,
      }),
      deliveryPackages || [],
    );
    const deliveryPackageSelectItem: ?SelectItemType = deliveryPackage
      ? {
          id: `${deliveryPackage.companyPackageRawId}`,
          label: deliveryPackage.name,
        }
      : null;
    return (
      <div styleName="container">
        <div styleName="title">
          <strong>Delivery</strong>
        </div>
        <div styleName="selectsWrapper">
          <div styleName="chooseCountry">
            <div styleName="select">
              <Select
                forForm
                fullWidth
                label="Country of dellivery"
                items={countries}
                onSelect={this.handleOnChangeCountry}
                activeItem={country}
                dataTest="productDeliveryCountrySelect"
              />
            </div>
          </div>
          <div styleName="chooseDeliveryCompany">
            <div styleName="select">
              <Select
                forForm
                fullWidth
                label="Transport company"
                items={transportCompanies}
                onSelect={log.debug}
                activeItem={deliveryPackageSelectItem}
                dataTest="productDeliveryPackageSelect"
                renderSelectItem={(item: SelectItemType) => {
                  const pkgType: ?PackageType = find(
                    whereEq({ companyPackageRawId: parseInt(item.id, 10) }),
                    this.state.deliveryPackages,
                  );
                  console.log({ item, deliveryPackage });
                  const isChecked =
                    deliveryPackage &&
                    parseInt(item.id, 10) ===
                      deliveryPackage.companyPackageRawId;
                  return (
                    pkgType && (
                      <div styleName="deliveryCompanyItem" key={pkgType.id}>
                        <div styleName="companyNameRow">
                          <CheckedIcon
                            styleName={classname('checked', {
                              hidden: !isChecked,
                            })}
                          />
                          <div styleName="companyNameWrap">
                            <div
                              styleName={classname('companyName', {
                                selected: isChecked,
                              })}
                            >
                              {isChecked ? (
                                <strong>{pkgType.name}</strong>
                              ) : (
                                pkgType.name
                              )}
                            </div>
                            <div
                              styleName={classname('price', {
                                selected: isChecked,
                              })}
                            >
                              {`${pkgType.price} STQ`}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  );
                }}
              />
            </div>
          </div>
        </div>
        {isFetching && (
          <div styleName="loading">
            <SpinnerCircle
              additionalStyles={{ width: '4rem', height: '4rem' }}
              containerStyles={{
                width: '4rem',
                height: '4rem',
                marginLeft: 0,
              }}
            />
          </div>
        )}
        {deliveryPackage && (
          <div key={deliveryPackage.id} styleName="deliveryPackage">
            <div styleName="td tdCompany">
              {deliveryPackage.logo !== null &&
                deliveryPackage.logo !== '' && (
                  <img src={deliveryPackage.logo} alt="" styleName="logo" />
                )}
              <span>{deliveryPackage.name}</span>
            </div>
            <div styleName="td tdPrice">{`${deliveryPackage.price} ${
              deliveryPackage.currency
            }`}</div>
          </div>
        )}
      </div>
    );
  }
}

Delivery.contextTypes = {
  environment: PropTypes.object.isRequired,
};

export default Delivery;
