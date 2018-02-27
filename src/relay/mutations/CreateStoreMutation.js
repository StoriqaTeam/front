// @flow

import { graphql, commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime';

const mutation = graphql`
  mutation CreateStoreMutation($input: CreateStoreInput!) {
    createStore(input: $input) {
      id
      rawId
      name
      currencyId
      shortDescription
      longDescription
      slug
    }
  }
`;

type MutationParamsType = {
  name: string,
  userId: string,
  currencyId: string,
  shortDescription: string,
  longDescription: string,
  slug: string,
  environment: Environment,
  onCompleted: ?(response: ?Object, errors: ?Array<Error>) => void,
  onError: ?(error: Error) => void,
};

const commit = (params: MutationParamsType) => commitMutation(params.environment, {
  mutation,
  variables: {
    input: {
      clientMutationId: '',
      name: params.name,
      userId: params.userId,
      currencyId: params.currencyId,
      shortDescription: params.shortDescription,
      longDescription: params.longDescription,
      slug: params.slug,
    },
  },
  onCompleted: params.onCompleted,
  onError: params.onError,
});

export default { commit };

/* {
 "input":{
 "clientMutationId": "",
 "name": "1q1q1q1q",
 "userId": 6,
 "currencyId": 1,
 "shortDescription": "short desc here",
 "longDescription": "long desc here",
 "slug": "1q1q1q1q"
 }
 } */
