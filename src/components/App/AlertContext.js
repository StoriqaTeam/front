// @flow

import * as React from 'react';

import type { AlertType } from 'components/Alerts';

export type AddAlertInputType = {
  type: AlertType,
  text: string,
  link: { text: string, path?: string },
};

export type AlertContextType = {
  addAlert: (props: AddAlertInputType) => void,
};

const {
  Provider: AlertContextProvider,
  Consumer: AlertContextConsumer,
} = React.createContext({ addAlert: () => {} });

const withShowAlert = (Component: React.ComponentType<any>) => {
  return class extends React.PureComponent<{}> {
    render() {
      return (
        <AlertContextConsumer>
          {(value: AlertContextType) => (
            <Component {...this.props} showAlert={value.addAlert} />
          )}
        </AlertContextConsumer>
      );
    }
  };
};

export { AlertContextProvider, AlertContextConsumer, withShowAlert };
