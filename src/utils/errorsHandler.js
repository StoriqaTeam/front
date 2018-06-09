// @flow

import { keys, isEmpty } from 'ramda';

import { log } from 'utils';

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
    if (callback) {
      callback();
    }
  };
  switch (keys(relayErrors)[0]) {
    case '100': {
      const { messages } = relayErrors['100'];
      if (!isEmpty(messages) && callback) {
        callback(messages);
      } else {
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
