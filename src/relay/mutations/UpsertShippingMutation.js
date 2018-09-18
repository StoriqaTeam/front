// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime';

import type {
  UpsertShippingMutationVariables,
  UpsertShippingMutationResponse,
} from './__generated__/UpsertShippingMutation.graphql';

const mutation = graphql`
  mutation UpsertShippingMutation($input: NewShippingInput!) {
    upsertShipping(input: $input) {
      local {
        companyPackageId
        price
        deliveriesTo {
          alpha3
          label
        }
      }
      international {
        companyPackageId
        price
        deliveriesTo {
          alpha3
          label
        }
      }
      pickup {
        price
        pickup
      }
    }
  }
`;

export type MutationParamsType = {|
  ...UpsertShippingMutationVariables,
  environment: Environment,
  onCompleted: ?(
    response: ?UpsertShippingMutationResponse,
    errors: ?Array<Error>,
  ) => void,
  onError: ?(error: Error) => void,
|};

const commit = (params: MutationParamsType) =>
  commitMutation(params.environment, {
    mutation,
    variables: {
      input: params.input,
    },
    onCompleted: params.onCompleted,
    onError: params.onError,
  });

export default { commit };
