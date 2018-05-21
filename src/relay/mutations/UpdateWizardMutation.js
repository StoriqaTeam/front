// @flow

import { graphql, commitMutation } from 'react-relay';
import { omit } from 'ramda';
import { Environment } from 'relay-runtime';

const mutation = graphql`
  mutation UpdateWizardMutation($input: UpdateWizardStoreInput!) {
    updateWizardStore(input: $input) {
      id
      rawId
      storeId
      name
      slug
      shortDescription
      defaultLanguage
      store {
        id
        rawId
      }
      addressFull {
        country
        value
        administrativeAreaLevel1
        administrativeAreaLevel2
        locality
        political
        postalCode
        route
        streetNumber
      }
      stepThree {
        edges {
          node {
            id
          }
        }
      }
    }
  }
`;

type AddressParamsType = {
  country?: string,
  value?: string,
  administrativeAreaLevel1?: string,
  administrativeAreaLevel2?: string,
  locality?: string,
  political?: string,
  postalCode?: string,
  route?: string,
  streetNumber?: string,
};

type MutationParamsType = {
  storeId?: number,
  name?: number,
  slug?: string,
  shortDescription?: number,
  defaultLanguage?: string,
  addressFull?: AddressParamsType,
  environment: Environment,
  onCompleted: ?(response: ?Object, errors: ?Array<Error>) => void,
  onError: ?(error: Error) => void,
};

const commit = (params: MutationParamsType) => {
  console.log('!!! UpdateWizardMutation params: ', params);
  return commitMutation(params.environment, {
    mutation,
    variables: {
      input: {
        clientMutationId: '',
        ...omit(['environment', 'onCompleted', 'onError'], params),
      },
    },
    onCompleted: params.onCompleted,
    onError: params.onError,
  });
};

export default { commit };
