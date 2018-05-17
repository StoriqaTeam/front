// @flow

import { graphql, commitMutation } from 'react-relay';
import { omit } from 'ramda';
import { Environment } from 'relay-runtime';

const mutation = graphql`
  mutation UpdateWizardMutation($input: UpdateWizardStoreInput!) {
    updateWizardStore(input: $input) {
      id
      rawId
      stepOne {
        name
        slug
        shortDescription
      }
      stepTwo {
        country
        address
        defaultLanguage
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

type MutationParamsType = {
  name?: number,
  slug?: string,
  shortDescription?: number,
  defaultLanguage?: string,
  country?: string,
  address?: string,
  administrativeAreaLevel1?: string,
  administrativeAreaLevel2?: string,
  locality?: string,
  political?: string,
  postalCode?: string,
  route?: string,
  streetNumber?: string,
  environment: Environment,
  onCompleted: ?(response: ?Object, errors: ?Array<Error>) => void,
  onError: ?(error: Error) => void,
};

const commit = (params: MutationParamsType) =>
  commitMutation(params.environment, {
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

export default { commit };
