// @flow strict

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { head, pathOr, find, propEq, map, isEmpty, isNil, length } from 'ramda';

import { Button, Select, RadioButton, SpinnerCircle } from 'components/common';
import { Modal } from 'components/Modal';
import { Icon } from 'components/Icon';
import { log, getCookie } from 'utils';
import { fetchAvailableShippingForUser } from 'relay/queries';

import type { SelectItemType, CountryType } from 'types';
import type { DeliveryAddress, DeliveryDataType, PackageType } from '../types';

import './Delivery.scss';

type StateType = {
  isFetching: boolean,
  showModal: boolean,
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
    showModal: false,
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
    this.setState({ showModal: true }, () => {
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
    });
  };

  handleCloseModal = () => {
    this.setState({
      showModal: false,
      country: null,
      deliveryPackage: null,
      deliveryPackages: null,
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

  handleOnSelectPackage = (deliveryPackage: PackageType) => {
    this.setState({
      deliveryPackage,
    });
  };

  handleOnSavePackage = () => {
    const { deliveryPackages } = this.state;
    if (!deliveryPackages || isEmpty(deliveryPackages)) {
      this.setState({
        showModal: false,
        // country: deliveryData.country,
        // deliveryPackage: deliveryData.deliveryPackage,
        // deliveryPackages: deliveryData.deliveryPackages,
      });
      return;
    }
    this.setState({ showModal: false }, () => {
      this.props.onChangeDeliveryData({
        deliveryPackage: this.state.deliveryPackage,
        country: this.state.country,
        deliveryPackages: this.state.deliveryPackages || [],
      });
    });
  };

  render() {
    // $FlowIgnore
    const selectedDeliveryPackage = pathOr(
      null,
      ['deliveryData', 'deliveryPackage'],
      this.props,
    );
    const {
      showModal,
      country,
      deliveryPackage,
      deliveryPackages,
      isFetching,
    } = this.state;
    const countries = map(
      item => ({ id: item.alpha3, label: item.label }),
      this.props.countries,
    );
    return (
      <div styleName="container">
        <div styleName="title">
          <strong>Delivery</strong>
        </div>
        <button styleName="selectDelivery" onClick={this.handleOpenModal}>
          <div>
            {selectedDeliveryPackage
              ? selectedDeliveryPackage.name
              : 'Choose company'}
          </div>
          <div styleName="icon">
            <Icon type="arrowExpand" />
          </div>
        </button>
        {selectedDeliveryPackage && (
          <div styleName="deliveryPrice">
            {`${selectedDeliveryPackage.price} ${
              selectedDeliveryPackage.currency
            }`}
          </div>
        )}
        <Modal showModal={showModal} onClose={this.handleCloseModal}>
          <div styleName="modal">
            <div styleName="title">
              <strong>Destination</strong>
            </div>
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
            <div>
              {country && (
                <div styleName="title">
                  <strong>Delivery method</strong>
                </div>
              )}
              {country && deliveryPackages && isEmpty(deliveryPackages) ? (
                <div styleName="notShippingText">
                  Seller does not ship to selected country
                </div>
              ) : (
                <div>
                  {country && (
                    <div styleName="table">
                      <div styleName="tableHeader">
                        <div styleName="td tdCompany">Transport company</div>
                        <div styleName="td tdPrice">Price</div>
                      </div>
                    </div>
                  )}
                  {map(
                    item => (
                      <div key={item.id} styleName="deliveryPackage">
                        <div styleName="td tdCompany">
                          <RadioButton
                            id={`productDelivery-${item.id}`}
                            isChecked={
                              !isNil(deliveryPackage) &&
                              deliveryPackage.id === item.id
                            }
                            onChange={() => {
                              this.handleOnSelectPackage(item);
                            }}
                          />
                          {item.logo !== null &&
                            item.logo !== '' && (
                              <img src={item.logo} alt="" styleName="logo" />
                            )}
                          <span>{item.name}</span>
                        </div>
                        <div styleName="td tdPrice">{`${item.price} ${
                          item.currency
                        }`}</div>
                      </div>
                    ),
                    deliveryPackages || [],
                  )}
                </div>
              )}
            </div>
            <div styleName="button">
              <Button
                big
                fullWidth
                disabled={!deliveryPackage}
                onClick={this.handleOnSavePackage}
                dataTest="productDeliveryConfirmButton"
              >
                <span>Ok</span>
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

Delivery.contextTypes = {
  environment: PropTypes.object.isRequired,
};

export default Delivery;
