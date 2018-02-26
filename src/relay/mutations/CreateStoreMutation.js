// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime';

const mutation = graphql`
  mutation CreateStoreMutation($input: CreateStoreInput!) {
    createStore(input: $input) {
      id
      rawId
      name
      isActive
      currencyId
      shortDescription
      longDescription
      slug
      phone
      email
      address
  }
}`;
