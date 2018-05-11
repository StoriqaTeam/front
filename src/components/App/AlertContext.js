// @flow

import { createContext } from 'react';

export type AlertType = 'default' | 'success' | 'warning' | 'danger';

export type AlertContextType = {
  showAlert?: ({ alertType: AlertType }) => void,
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
