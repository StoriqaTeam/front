// @flow strict

import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';

import type { WizardProductsStep_baseProduct as BaseProductType } from './__generated__/WizardProductsStep_baseProduct.graphql';

export default createFragmentContainer(
  (props: { product: BaseProductType }) => <div>{props.product.id}</div>,
  graphql`
    fragment WizardProductsStep_baseProduct on BaseProduct {
      id
      products {
        edges {
          node {
            id
            discount
            photoMain
            cashback
            price
          }
        }
      }
    }
  `,
);
