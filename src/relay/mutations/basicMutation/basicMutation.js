// @flow strict

import { commitMutation } from 'react-relay';
import { Environment } from 'relay-runtime';
import { head } from 'ramda';

import { log } from 'utils';

type MutationType<V, R> = (params: {|
  environment: Environment,
  variables: V,
  optimisticResponse?: R,
  updater?: {},
|}) => Promise<R>;

export type { MutationType };

const basicMutation = <V: {}, R: {}>(
  mutation: string,
  objectRootField: $Keys<R>,
): MutationType<V, R> => (params: {
  environment: Environment,
  variables: V,
  optimisticResponse?: R,
  updater?: {},
}) => {
  if (!params.environment || params.variables == null) {
    return Promise.reject(
      new Error('Please provide environment and variables'),
    );
  }

  return new Promise((resolve, reject) => {
    commitMutation(params.environment, {
      mutation,
      variables: params.variables,
      onCompleted: (response: ?R, errors: ?Array<Error>) => {
        log.debug('Mutation completed', { response, errors });
        if (response != null) {
          console.log('---objectRootField', objectRootField);
          if (objectRootField != null) {
            if (response[objectRootField]) {
              resolve(response);
            } else {
              reject(head(errors || [new Error('No root field')]));
            }
          } else {
            resolve(response);
          }
        } else if (errors) {
          reject(errors);
        } else {
          reject(new Error('Unknown error'));
        }
      },
      onError: (error: Error) => {
        reject(error);
      },
      optimisticResponse: params.optimisticResponse,
      updater: params.updater,
    });
  });
};

export default basicMutation;
