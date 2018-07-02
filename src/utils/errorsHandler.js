// @flow

import { keys, isEmpty, pathOr } from 'ramda';

import { log } from 'utils';

import type { ProcessedErrorType } from 'utils/fromRelayError';

export type AlertType = 'default' | 'success' | 'warning' | 'danger';

export type AlertPropsType = {
  type: AlertType,
  text: string,
  link: { text: string, path?: string },
  onClose?: (timestamp: number) => void,
  onClick?: () => void,
};

// first arg is relayErrors - standart error object
// second arg is alertShow callback for show alerts in common cases
// third arg is callback for handling validation errors
export const errorsHandler = (
  relayErrors: ?ProcessedErrorType,
  showAlertHandler: (config: AlertPropsType) => void,
  callback?: (messages?: {
    [string]: Array<string>,
  }) => void,
) => {
  log.debug({ relayErrors });
  const handleDefaultEvent = (code: string) => {
    // $FlowIgnoreMe
    const status = pathOr(null, [code, 'status'], relayErrors);
    showAlertHandler({
      type: 'danger',
      // $FlowIgnoreMe
      text: `Error: "${status}"`,
      link: { text: 'Close.' },
    });
    if (callback) {
      callback();
    }
  };
  if (!relayErrors) {
    return;
  }
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
