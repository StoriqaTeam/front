// @flow

import React, { PureComponent } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { pathOr } from 'ramda';

import type { SelectItemType } from 'types';
import type { Shipping_baseProduct as ShippingBaseProductType } from './__generated__/Shipping_baseProduct.graphql';

import { LocalShipping, InterShipping } from '../index';

type PropsType = {
  currency: SelectItemType,
  baseProduct: ShippingBaseProductType,
};

class Shipping extends PureComponent<PropsType> {
  render() {
    const { currency, baseProduct } = this.props;
    // $FlowIgnore
    const localShippig = pathOr([], ['shipping', 'local'], baseProduct);
    // $FlowIgnore
    const interShippig = pathOr([], ['shipping', 'international'], baseProduct);
    // $FlowIgnore
    const pickupShippig = pathOr(null, ['shipping', 'pickup'], baseProduct);
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
          localShippig={localShippig}
          pickupShippig={pickupShippig}
          localAvailablePackages={localAvailablePackages}
        />
        <InterShipping
          currency={currency}
          interShippig={interShippig}
          interAvailablePackages={interAvailablePackages}
        />
      </div>
    );
  }
}

export default createFragmentContainer(
  Shipping,
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
            label
            parent
            level
            children {
              label
              parent
              level
              children {
                alpha3
                alpha2
                label
              }
              alpha2
              alpha3
              numeric
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
            label
            parent
            level
            children {
              label
              parent
              level
              children {
                parent
                alpha3
                alpha2
                label
              }
              alpha2
              alpha3
              numeric
            }
            alpha2
            alpha3
            numeric
          }
        }
      }
    }
  `,
);
