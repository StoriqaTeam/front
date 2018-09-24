// @flow

import { keys, isEmpty, pathOr, values } from 'ramda';

import type { ProcessedErrorType } from 'utils/fromRelayError';

import type { AlertType } from 'components/Alerts/types';

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
  alertHandler: (config: AlertPropsType) => void,
  callback?: (messages?: {
    [string]: Array<string>,
  }) => void,
) => {
  const displayAlert = (errorName: string): void => {
    alertHandler({
      type: 'danger',
      text: `Error: "${errorName}"`,
      link: { text: 'Close.' },
    });
  };
  const handleErrorCode = (code: string) => {
    // $FlowIgnoreMe
    const status = pathOr(null, [code, 'status'], relayErrors);
    // $FlowIgnoreMe
    displayAlert(status);
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
        const [errorMessage] = values(messages);
        if (!isEmpty(errorMessage)) {
          displayAlert(...errorMessage);
        }
      } else {
        handleErrorCode('100');
      }
      break;
    }
    case '200':
      handleErrorCode('200');
      break;
    case '300':
      handleErrorCode('300');
      break;
    case '400':
      handleErrorCode('400');
      break;
    default: {
      break;
    }
  }
};
