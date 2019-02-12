// @flow strict

import React, { Component } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { pathOr, map, isEmpty } from 'ramda';

import { withShowAlert } from 'components/Alerts/AlertContext';

import type { SelectItemType } from 'types';

import { convertCountriesToArrCodes } from './utils';
import type {
  ShippingChangeDataType,
  RequestLocalShippingType,
  RequestInterShippingType,
  PickupShippingType,
  FullShippingType,
} from './types';

import type { Shipping_baseProduct as ShippingBaseProductType } from './__generated__/Shipping_baseProduct.graphql';

import { LocalShipping, InterShipping } from './index';

type StateType = {
  local: Array<RequestLocalShippingType>,
  international: Array<RequestInterShippingType>,
  pickup: PickupShippingType,
  withoutInter: boolean,
  withoutLocal: boolean,
};

type PropsType = {
  currency: SelectItemType,
  baseProduct: ShippingBaseProductType,
  onChangeShipping: (shippingData: ?FullShippingType) => void,
  shippingErrors: ?{
    local?: string,
    inter?: string,
  },
};

class Shipping extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    // $FlowIgnore
    const shipping = pathOr(
      null,
      ['baseProduct', 'shipping'],
      props.baseProduct,
    );
    this.state = {
      local: [],
      international: [],
      pickup: {
        pickup: false,
        price: 0,
      },
      withoutInter: Boolean(shipping && isEmpty(shipping.international)),
      withoutLocal: Boolean(
        shipping && shipping.pickup && !shipping.pickup.pickup,
      ),
    };
    props.onChangeShipping(this.state);
  }

  componentDidUpdate(prevProps: PropsType, prevState: StateType) {
    const { state } = this;
    if (JSON.stringify(state) !== JSON.stringify(prevState)) {
      this.props.onChangeShipping({ ...this.state });
    }
  }

  handleOnChangeShippingData = (data: ShippingChangeDataType) => {
    const { companies, inter, pickup, withoutInter, withoutLocal } = data;
    if (withoutInter !== undefined) {
      this.setState({ withoutInter });
    }
    if (withoutLocal !== undefined) {
      this.setState({ withoutLocal });
    }
    if (companies) {
      if (inter === true) {
        const international = map(
          item => ({
            companyPackageId: item.companyPackageRawId,
            price: item.price,
            deliveriesTo: convertCountriesToArrCodes({
              countries: item.countries,
            }),
          }),
          companies,
        );
        this.setState({ international });
        return;
      }
      const local = map(
        item => ({
          companyPackageId: item.companyPackageRawId,
          price: item.price,
        }),
        companies,
      );
      this.setState({ local });
    }
    if (pickup) {
      this.setState({ pickup });
    }
  };

  render() {
    const { currency, baseProduct, shippingErrors } = this.props;
    // $FlowIgnore
    const localShipping = pathOr([], ['shipping', 'local'], baseProduct);
    // $FlowIgnore
    const interShipping = pathOr(
      [],
      ['shipping', 'international'],
      baseProduct,
    );
    // $FlowIgnore
    const pickupShipping = pathOr({}, ['shipping', 'pickup'], baseProduct);
    // $FlowIgnore
    const localAvailablePackages = pathOr(
      [],
      ['availablePackages', 'local'],
      this.props,
    );
    // $FlowIgnore
    const interAvailablePackages = pathOr(
      [],
      ['availablePackages', 'international'],
      this.props,
    );
    return (
      <div>
        <LocalShipping
          currency={currency}
          localShipping={localShipping}
          pickupShipping={pickupShipping}
          localAvailablePackages={localAvailablePackages}
          onChangeShippingData={this.handleOnChangeShippingData}
          error={shippingErrors ? shippingErrors.local : null}
        />
        <InterShipping
          currency={currency}
          interShipping={interShipping}
          interAvailablePackages={interAvailablePackages}
          onChangeShippingData={this.handleOnChangeShippingData}
          error={shippingErrors ? shippingErrors.inter : null}
        />
      </div>
    );
  }
}

export default createFragmentContainer(
  withShowAlert(Shipping),
  graphql`
    fragment Shipping_baseProduct on BaseProduct {
      shipping {
        local {
          companyPackageId
          price
        }
        international {
          companyPackageId
          price
          deliveriesTo {
            children {
              label
              children {
                parent
                alpha3
                alpha2
                label
              }
              alpha3
            }
          }
        }
        pickup {
          price
          pickup
        }
      }
    }
  `,
);
