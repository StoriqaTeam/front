// @flow

import { graphql, commitMutation } from 'react-relay';
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
  shortDescription?: number,
  defaultLanguage?: string,
  slug?: string,
  country?: string,
  address?: string,
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
        name: params.name,
        shortDescription: params.shortDescription,
        defaultLanguage: params.defaultLanguage,
        slug: params.slug,
        country: params.country,
        address: params.address,
      },
    },
    onCompleted: params.onCompleted,
    onError: params.onError,
  });

export default { commit };
