// @flow

// TODO: rename to UpdateStoreContactsMutation

import { graphql, commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime';

const mutation = graphql`
  mutation UpdateStoreMutation($input: UpdateStoreInput!) {
    updateStore(input: $input) {
      id
      rawId
      defaultLanguage
      email
      phone
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
      address
      country
      facebookUrl
      twitterUrl
      instagramUrl
    }
  }
`;

type MutationParamsType = {
  id: string,
  defaultLanguage: string,
  email: string,
  phone: string,
  country: string,
  address: string,
  administrativeAreaLevel1: string,
  administrativeAreaLevel2: string,
  locality: string,
  political: string,
  postalCode: string,
  route: string,
  streetNumber: string,
  facebookUrl: string,
  twitterUrl: string,
  instagramUrl: string,
  environment: Environment,
  onCompleted: ?(response: ?Object, errors: ?Array<Error>) => void,
  onError: ?(error: Error) => void,
};

const commit = (params: MutationParamsType) => { 
  console.log('!!! UpdateStoreMutation params: ', params);
  return commitMutation(params.environment, {
    mutation,
    variables: {
      input: {
        clientMutationId: '',
        id: params.id,
        defaultLanguage: params.defaultLanguage,
        email: params.email,
        phone: params.phone,
        country: params.country,
        address: params.address,
        administrativeAreaLevel1: params.administrativeAreaLevel1,
        administrativeAreaLevel2: params.administrativeAreaLevel2,
        locality: params.locality,
        political: params.political,
        postalCode: params.postalCode,
        route: params.route,
        streetNumber: params.streetNumber,
        facebookUrl: params.facebookUrl,
        twitterUrl: params.twitterUrl,
        instagramUrl: params.instagramUrl,
      },
    },
    onCompleted: params.onCompleted,
    onError: params.onError,
  });
}

export default { commit };
