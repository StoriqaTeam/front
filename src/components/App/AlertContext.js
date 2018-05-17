// @flow

import { createContext } from 'react';

import type { AlertPropsType } from 'components/Alerts';

export type AlertContextType = {
  showAlert: (props: AlertPropsType) => void,
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
