// @flow

import React, { Component } from 'react';
import { createFragmentContainer, graphql, Relay } from 'react-relay';
import { pathOr, map, isEmpty } from 'ramda';

import { withShowAlert } from 'components/App/AlertContext';
import { Button } from 'components/common/Button';
import { log, fromRelayError } from 'utils';
import { UpsertShippingMutation } from 'relay/mutations';

import type { AddAlertInputType } from 'components/App/AlertContext';
import type { SelectItemType } from 'types';
import type { MutationParamsType as UpsertShippingMutationType } from 'relay/mutations/UpsertShippingMutation';

import { convertCountriesToArrCodes } from './utils';
import type {
  ShippingChangeDataType,
  RequestLocalShippingType,
  RequestInterShippingType,
  PickupShippingType,
} from './types';

import type { Shipping_baseProduct as ShippingBaseProductType } from './__generated__/Shipping_baseProduct.graphql';

import { LocalShipping, InterShipping } from '../index';

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
  baseProductId: number,
  storeId: number,
  showAlert: (input: AddAlertInputType) => void,
  relay: Relay,
};

class Shipping extends Component<PropsType, StateType> {
  state = {
    local: [],
    international: [],
    pickup: {
      pickup: false,
      price: 0,
    },
    withoutInter: false,
    withoutLocal: false,
  };

  handleSave = () => {
    const { baseProductId, storeId, relay } = this.props;
    const {
      local,
      international,
      pickup,
      withoutInter,
      withoutLocal,
    } = this.state;
    const params: UpsertShippingMutationType = {
      input: {
        local: withoutLocal ? [] : local,
        international: withoutInter ? [] : international,
        pickup: withoutLocal ? { ...pickup, pickup: false } : pickup,
        baseProductId,
        storeId,
      },
      environment: relay.environment,
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
        log.debug({ response, errors });

        const relayErrors = fromRelayError({ source: { errors } });
        log.debug({ relayErrors });

        // $FlowIgnoreMe
        const validationErrors = pathOr({}, ['100', 'messages'], relayErrors);
        if (!isEmpty(validationErrors)) {
          this.props.showAlert({
            type: 'danger',
            text: 'Validation Error!',
            link: { text: 'Close.' },
          });
          return;
        }

        // $FlowIgnoreMe
        const statusError: string = pathOr({}, ['100', 'status'], relayErrors);
        if (!isEmpty(statusError)) {
          this.props.showAlert({
            type: 'danger',
            text: `Error: "${statusError}"`,
            link: { text: 'Close.' },
          });
          return;
        }

        // $FlowIgnoreMe
        const parsingError = pathOr(null, ['300', 'message'], relayErrors);
        if (parsingError) {
          log.debug('parsingError:', { parsingError });
          this.props.showAlert({
            type: 'danger',
            text: 'Something going wrong :(',
            link: { text: 'Close.' },
          });
          return;
        }
        if (errors) {
          this.props.showAlert({
            type: 'danger',
            text: 'Something going wrong :(',
            link: { text: 'Close.' },
          });
          return;
        }
        this.props.showAlert({
          type: 'success',
          text: 'Deliveryt update!',
          link: { text: '' },
        });
      },
      onError: (error: Error) => {
        log.error(error);
        this.props.showAlert({
          type: 'danger',
          text: 'Something going wrong.',
          link: { text: 'Close.' },
        });
      },
    };
    UpsertShippingMutation.commit(params);
  };

  handleOnChangeShippingData = (data: ShippingChangeDataType) => {
    const { companies, inter, pickup, withoutInter, withoutLocal } = data;
    if (withoutInter !== undefined) {
      this.setState({ withoutInter });
      return;
    }
    if (withoutLocal !== undefined) {
      this.setState({ withoutLocal });
      return;
    }
    if (companies) {
      if (inter) {
        const international = map(
          item => ({
            companyPackageId: item.companyPackageRawId,
            price: item.price,
            deliveriesTo: convertCountriesToArrCodes(item.countries),
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
    const { currency, baseProduct } = this.props;
    // $FlowIgnore
    const localShipping = pathOr([], ['shipping', 'local'], baseProduct);
    // $FlowIgnore
    const interShipping = pathOr(
      [],
      ['shipping', 'international'],
      baseProduct,
    );
    // $FlowIgnore
    const pickupShipping = pathOr(null, ['shipping', 'pickup'], baseProduct);
    // $FlowIgnore
    const localAvailablePackages = pathOr(
      [],
      ['availablePackages', 'local'],
      baseProduct,
    );
    // $FlowIgnore
    const interAvailablePackages = pathOr(
      [],
      ['availablePackages', 'international'],
      baseProduct,
    );
    return (
      <div className="container">
        <LocalShipping
          currency={currency}
          localShipping={localShipping}
          pickupShipping={pickupShipping}
          localAvailablePackages={localAvailablePackages}
          onChangeShippingData={this.handleOnChangeShippingData}
        />
        <InterShipping
          currency={currency}
          interShipping={interShipping}
          interAvailablePackages={interAvailablePackages}
          onChangeShippingData={this.handleOnChangeShippingData}
        />
        <Button big fullWidth onClick={this.handleSave} dataTest="">
          Save
        </Button>
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
      availablePackages {
        local {
          companyPackageId
          companyPackageRawId
          name
          logo
        }
        international {
          companyPackageId
          companyPackageRawId
          name
          logo
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
      }
    }
  `,
);
