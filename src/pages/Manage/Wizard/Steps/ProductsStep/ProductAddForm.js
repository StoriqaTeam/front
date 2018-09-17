// @flow strict

import { createFragmentContainer, graphql } from 'react-relay';

import { withShowAlert } from 'components/App/AlertContext';

import ProductForm from './ProductForm';

import type { ProductForm_rootCategory as ProductFormRootCategory } from './__generated__/ProductForm_rootCategory.graphql';
import type { ProductForm_store as ProductFormStore } from './__generated__/ProductForm_store.graphql';

class ProductAddForm extends ProductForm {}

export default createFragmentContainer(
  withShowAlert(ProductAddForm),
  graphql`
    fragment ProductAddForm_rootCategory on Category {
      id
      ...CategorySelector_rootCategory
    }

    fragment ProductAddForm_store on Store {
      id
      rawId
    }
  `,
);
