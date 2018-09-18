// @flow strict

import { createFragmentContainer, graphql } from 'react-relay';

import { log } from 'utils';

import ProductForm from './ProductForm';

import type { WizardEditProductForm_product as ProductType } from './__generated__/WizardEditProductForm_product.graphql';

type PropsType = {
  product: ?ProductType,
};

class EditForm extends ProductForm<PropsType> {
  static getDerivedStateFromProps(
    nextProps: { product: ?ProductType },
    prevState: *,
  ) {
    log.debug('getDerivedStateFromProps', { nextProps, prevState });
    return {
      ...prevState,
      form: {
        ...prevState.form,
        categoryId:
          nextProps.product &&
          nextProps.product.baseProduct &&
          nextProps.product.baseProduct.categoryId,
      },
    };
  }
}

export default createFragmentContainer(
  EditForm,
  graphql`
    fragment WizardEditProductForm_product on Product {
      id
      rawId
      discount
      currency
      photoMain
      additionalPhotos
      vendorCode
      cashback
      price
      attributes {
        metaField
        attrId
        value
        attribute {
          id
        }
      }
      quantity
      baseProduct {
        categoryId
      }
    }
  `,
);
