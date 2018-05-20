// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime';

const mutation = graphql`
  mutation CreateWizardMutation {
    createWizardStore {
      id
      rawId
      storeId
      stepOne {
        name
        slug
        shortDescription
      }
      stepTwo {
        country
        address
        defaultLanguage
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
    updater: relayStore => {
      const me = relayStore.getRoot().getLinkedRecord('me');
      const wizardRecord = relayStore.getRootField('createWizardStore');
      me.setLinkedRecord(wizardRecord, 'wizardStore');
    },
  });

export default { commit };
