// @flow strict

import React, { Component } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';

import './Delivery.scss';

type StateType = {
  //
};

type PropsType = {
  //
};

class Delivery extends Component<PropsType, StateType> {
  render() {
    console.log('---this.props', this.props);
    return (
      <div styleName="container">
        <div styleName="title">
          <strong>Delivery</strong>
        </div>
      </div>
    );
  }
}

export default createFragmentContainer(
  Delivery,
  graphql`
    fragment Delivery_baseProduct on BaseProduct {
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
