// @flow strict

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  head,
  pathOr,
  find,
  propEq,
  map,
  length,
  whereEq,
  isEmpty,
} from 'ramda';
import classname from 'classnames';

import { Select, SpinnerCircle } from 'components/common';
import { log, getCookie, formatPrice, checkCurrencyType } from 'utils';
import { fetchAvailableShippingForUser } from 'relay/queries';

import type { SelectItemType, CountryType, AllCurrenciesType } from 'types';
import type { DeliveryAddress, DeliveryDataType, PackageType } from '../types';

import CheckedIcon from './img/checked.svg';
import './Delivery.scss';

import t from './i18n';

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
  currency: AllCurrenciesType,
};

class Delivery extends Component<PropsType, StateType> {
  state = {
    isFetching: false,
    country: null,
    deliveryPackage: null,
    deliveryPackages: null,
  };

  componentDidMount() {
    if (this.state.country) {
      return;
    }
    const { deliveryData } = this.props;
    if (!deliveryData.country) {
      this.fetchData();
    }
  }

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
      log.debug({ cookiesCountry });
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
        this.setState(
          {
            deliveryPackages,
            deliveryPackage,
            country: country
              ? { id: country.alpha3, label: country.label }
              : null,
          },
          () => {
            this.handleOnSavePackage();
          },
        );
        return true;
      })
      .finally(() => {
        this.setState({ isFetching: false });
      })
      .catch(error => {
        log.error(error);
      });
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

  handleOnSelectPackage = (item: SelectItemType) => {
    const deliveryPackage = find(
      whereEq({ companyPackageRawId: parseInt(item.id, 10) }),
      this.state.deliveryPackages || [],
    );

    this.setState(
      {
        deliveryPackage,
      },
      () => {
        this.handleOnSavePackage();
      },
    );
  };

  handleOnSavePackage = () => {
    this.props.onChangeDeliveryData({
      deliveryPackage: this.state.deliveryPackage,
      country: this.state.country,
      deliveryPackages: this.state.deliveryPackages || [],
    });
  };

  render() {
    const { currency } = this.props;
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
          <strong>{t.delivery}</strong>
        </div>
        <div styleName="selectsWrapper">
          <div styleName="chooseCountry">
            <div styleName="select">
              <Select
                withInput
                forForm
                fullWidth
                label="Country of dellivery"
                items={countries}
                onSelect={this.handleOnChangeCountry}
                activeItem={country}
                dataTest="productDeliveryCountrySelect"
              />
            </div>
            {isFetching && (
              <div styleName="loading">
                <SpinnerCircle
                  additionalStyles={{
                    width: '3rem',
                    height: '3rem',
                  }}
                  containerStyles={{
                    marginLeft: '3rem',
                    marginTop: '3rem',
                  }}
                />
              </div>
            )}
          </div>
          <div styleName="chooseDeliveryCompany">
            <div styleName="select">
              {!isFetching &&
                deliveryPackages instanceof Array &&
                deliveryPackages.length > 0 && (
                  <Select
                    forForm
                    fullWidth
                    label="Transport company"
                    items={transportCompanies}
                    onSelect={log.debug}
                    activeItem={deliveryPackageSelectItem}
                    dataTest="productDeliveryPackageSelect"
                    maxItemsHeight={18.5}
                    renderSelectItem={(item: SelectItemType) => {
                      const pkgType: ?PackageType = find(
                        whereEq({ companyPackageRawId: parseInt(item.id, 10) }),
                        this.state.deliveryPackages || [],
                      );
                      const isChecked =
                        deliveryPackage &&
                        parseInt(item.id, 10) ===
                          deliveryPackage.companyPackageRawId;
                      return (
                        pkgType && (
                          /* eslint-disable */
                          <div
                            styleName="deliveryCompanyItem"
                            key={pkgType.id}
                            onClick={() => {
                              this.handleOnSelectPackage(item);
                            }}
                            /* eslint-enable */
                          >
                            <div styleName="companyNameRow">
                              <div
                                styleName={classname('checkedIcon', {
                                  hidden: !isChecked,
                                })}
                              >
                                <CheckedIcon />
                              </div>
                              <div styleName="companyNameWrap">
                                <div
                                  styleName={classname('companyName', {
                                    selected: isChecked,
                                  })}
                                >
                                  {isChecked === true ? (
                                    <strong>{pkgType.name}</strong>
                                  ) : (
                                    <span>{pkgType.name}</span>
                                  )}
                                </div>
                                <div
                                  styleName={classname('price', {
                                    selected: isChecked,
                                  })}
                                >
                                  {`${formatPrice(
                                    pkgType.price,
                                    checkCurrencyType(currency) === 'fiat'
                                      ? 2
                                      : undefined,
                                  )} ${currency || ''}`}
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      );
                    }}
                  />
                )}
            </div>
          </div>
        </div>
        {country &&
          !isFetching &&
          isEmpty(deliveryPackages) && (
            <div styleName="notShipping">{t.sellerDoesNotShip}</div>
          )}
        {deliveryPackage && (
          <Fragment>
            <div key={deliveryPackage.id} styleName="deliveryPackage">
              <div styleName="logoWrapper">
                {deliveryPackage.logo !== null &&
                  deliveryPackage.logo !== '' && (
                    <img src={deliveryPackage.logo} alt="" styleName="logo" />
                  )}
              </div>
              <div styleName="textWrapper">
                <div styleName="pkgName">{t.price}</div>
                <div styleName="pkgPrice">
                  {formatPrice(
                    deliveryPackage.price,
                    checkCurrencyType(currency) === 'fiat' ? 2 : undefined,
                  )}{' '}
                  {currency}
                </div>
              </div>
            </div>
            <div styleName="warning">{t.warning}</div>
          </Fragment>
        )}
      </div>
    );
  }
}

Delivery.contextTypes = {
  environment: PropTypes.object.isRequired,
};

export default Delivery;
