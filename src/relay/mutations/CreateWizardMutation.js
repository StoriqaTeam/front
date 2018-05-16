// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime';

const mutation = graphql`
  mutation CreateWizardMutation {
    createWizardStore {
      id
      rawId
      stepOne {
        name
      }
      stepTwo {
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
  environment: Environment,
  onCompleted: ?(response: ?Object, errors: ?Array<Error>) => void,
  onError: ?(error: Error) => void,
  updater: ?(store: any) => void,
};

const commit = (params: MutationParamsType) =>
  commitMutation(params.environment, {
    mutation,
    onCompleted: params.onCompleted,
    onError: params.onError,
    updater: params.updater,
  });

export default { commit };
