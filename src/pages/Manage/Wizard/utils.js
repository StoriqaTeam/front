// @flow

import { log, fromRelayError } from 'utils';
import { evolve, pathOr, isEmpty, reduce, keys } from 'ramda';
import type { ProcessedErrorType } from 'utils/fromRelayError';
import type { AlertPropsType } from 'components/Alerts/Alert';

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

// first arg is relayErrors - standart error object
// second arg is alertShow callback for show alerts in common cases
// third arg is callback for handling validation errors
export const errorsHandler = (
  relayErrors: ProcessedErrorType,
  showAlertHandler: (config: AlertPropsType) => void,
  callback?: (messages: {
    [string]: Array<string>,
  }) => void,
) => {
  log.debug({ relayErrors });
  const handleDefaultEvent = (code: string) => {
    const { status } = relayErrors[code];
    showAlertHandler({
      type: 'danger',
      text: `Error: "${status}"`,
      link: { text: 'Close.' },
    });
    callback();
  }
  switch(keys(relayErrors)[0]) {
    case '100': { 
      const { messages } = relayErrors['100'];
      if (!isEmpty(messages)) {
        callback(messages);
      }
      else {
        handleDefaultEvent('100');
      }
      break;
    }
    case '200': 
      handleDefaultEvent('200');
      break;
    case '300': 
      handleDefaultEvent('300');
      break;
    case '400': 
      handleDefaultEvent('400');
      break;
    default: { 
      break;
    }
  }
};
