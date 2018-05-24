// @flow

import { log, fromRelayError } from 'utils';
import { evolve, pathOr, isEmpty, reduce } from 'ramda';

export const resposeLogger = (response: ?Object, errors: ?Array<any>) => {
  log.debug({ response, errors });
  const relayErrors = fromRelayError({ source: { errors } });
  log.debug({ relayErrors });
  // $FlowIgnoreMe
  const validationErrors = pathOr({}, ['100', 'messages'], relayErrors);
  // $FlowIgnoreMe
  const status = pathOr('', ['100', 'status'], relayErrors);
  if (validationErrors && !isEmpty(validationErrors)) {
    // this.setState({ formErrors: validationErrors });
    return validationErrors;
  } else if (status) {
    // $FlowIgnoreMe
    alert(`Error: "${status}"`); // eslint-disable-line
  }
  return null;
};

export const errorsLogger = (error: Error) => {
  log.debug({ error });
  const relayErrors = fromRelayError(error);
  log.debug({ relayErrors });
  // $FlowIgnoreMe
  const validationErrors = pathOr(null, ['100', 'messages'], relayErrors);
  if (validationErrors) {
    // this.setState({ formErrors: validationErrors });
    return validationErrors;
  }
  // eslint-disable-next-line
  alert('Something going wrong :(');
  return null;
};

export const transformTranslated = (
  lang: string,
  arr: Array<string>,
  obj: any,
) => {
  const transformation = reduce(
    (acc, next) => ({
      ...acc,
      [next]: text => ({
        lang,
        text,
      }),
    }),
    {},
    arr,
  );
  return evolve(transformation, obj);
};
