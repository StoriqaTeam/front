// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime';

import type {
  CreateCustomAttributeMutationVariables,
  CreateCustomAttributeMutationResponse,
} from './__generated__/CreateCustomAttributeMutation.graphql';
import { map } from 'ramda';

const mutation = graphql`
  mutation CreateCustomAttributeMutation($input: NewCustomAttributeInput!) {
    createCustomAttribute(input: $input) {
      id
      rawId
      attribute {
        id
        rawId
        name {
          lang
          text
        }
        valueType
        metaField {
          values
          translatedValues {
            translations {
              lang
              text
            }
          }
          uiElement
        }
      }
    }
  }
`;

export type MutationParamsType = {|
  ...CreateCustomAttributeMutationVariables,
  baseProductId: string,
  environment: Environment,
  onCompleted: ?(
    response: ?CreateCustomAttributeMutationResponse,
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
    updater: relayStore => {
      const baseProductProxy = relayStore.get(params.baseProductId);
      const attribute = relayStore.getRootField('createCustomAttribute');
      const customAttributes = baseProductProxy.getLinkedRecords(
        'customAttributes',
      );
      const newCustomAttributes = [...customAttributes, attribute];
      baseProductProxy.setLinkedRecords(
        newCustomAttributes,
        'customAttributes',
      );
    },
  });

export default { commit };
