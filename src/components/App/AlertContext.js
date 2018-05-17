// @flow

import { createContext } from 'react';

import type { AlertType } from 'components/Alerts';

export type AlertContextType = {
  addAlert: (props: {
    type: AlertType,
    text: string,
    link: { text: string, path?: string },
  }) => void,
};

const {
  Provider: AlertContextProvider,
  Consumer: AlertContextConsumer,
} = createContext({});

export { AlertContextProvider, AlertContextConsumer };

/*
import { AlertContextConsumer } from 'components/App/AlertContext';

import type { AlertContextType } from 'components/App/AlertContext';

<AlertContextConsumer>
  {(value: AlertContextType) => (
    <Fragment>
      <button onClick={() => value.showAlert({ alertType: 'default' })}>
        test
      </button>
      <button onClick={() => value.showAlert({ alertType: 'success' })}>
        test
      </button>
    </Fragment>
  )}
</AlertContextConsumer>
*/
