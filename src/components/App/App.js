// @flow

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { createRefetchContainer, graphql } from 'react-relay';
import type { Environment } from 'relay-runtime';
import { pick, filter, propEq, concat, complement, pathOr } from 'ramda';
import { withRouter, matchShape } from 'found';

import { AlertsContainer } from 'components/Alerts';
import { AlertContextProvider } from 'components/Alerts/AlertContext';
import { currentUserShape } from 'utils/shapes';

import type { AlertPropsType } from 'components/Alerts/types';
import type { AddAlertInputType } from 'components/Alerts/AlertContext';

import { setCookie, getCookie, getQueryRefParams } from 'utils';

import type {
  CategoryType,
  LanguageType,
  CurrencyType,
  FiatCurrencyType,
  CryptoCurrencyType,
  SellerCurrencyType,
  OrderStatusesType,
  DirectoriesType,
  CurrencyExchangeType,
} from 'types';

import { AppContext } from './index';

import './App.scss';

type StateType = {
  alerts: Array<AlertPropsType>,
};

type PropsType = {
  me: ?{},
  mainPage: ?{},
  cart: ?{},
  languages: Array<LanguageType>,
  currencies: Array<CurrencyType>,
  fiatCurrencies: Array<FiatCurrencyType>,
  cryptoCurrencies: Array<CryptoCurrencyType>,
  sellerCurrencies: Array<SellerCurrencyType>,
  categories: CategoryType,
  orderStatuses: OrderStatusesType,
  currencyExchange: CurrencyExchangeType,
  children: any,
  relay: {
    environment: Environment,
    refetch: Function,
  },
  countries: any,
  match: matchShape,
};

class App extends Component<PropsType, StateType> {
  state = {
    alerts: [],
  };

  getChildContext() {
    const { relay, me = {} } = this.props;
    return {
      environment: relay.environment,
      handleLogin: this.handleLogin,
      currentUser: pick(['id', 'rawId'], me || {}),
      directories: {
        ...this.makeDirectories(),
      },
    };
  }

  componentDidMount() {
    // $FlowIgnoreMe
    const query = pathOr({}, ['match', 'location', 'query'], this.props);
    const queryRefParams = getQueryRefParams(query);
    if (process.env.BROWSER && document.referrer && !getCookie('REFERER')) {
      setCookie('REFERER', document.referrer);
    }
    if (queryRefParams.referal && !getCookie('REFERAL')) {
      setCookie('REFERAL', queryRefParams.referal);
    }
    if (queryRefParams.utmMarks && !getCookie('UTM_MARKS')) {
      setCookie('UTM_MARKS', queryRefParams.utmMarks);
    }
  }

  componentDidUpdate(prevProps) {
    const {
      match: {
        location: { pathname },
      },
    } = this.props;
    const {
      match: { location },
    } = prevProps;
    // ONLY scroll when paths are different
    if (pathname !== location.pathname) {
      if (process.env.BROWSER) {
        window.scrollTo(0, 0);
      }
    }
  }

  addAlert = (alert: AddAlertInputType): void => {
    this.setState(prevState => ({
      alerts: concat(
        [
          {
            ...alert,
            onClose: this.handleAlertClose,
            createdAtTimestamp: Date.now() + Math.random() * 1000,
          },
        ],
        prevState.alerts,
      ),
    }));
  };

  handleLogin = (): void => {
    this.props.relay.refetch({}, null, () => {}, { force: true });
  };

  handleAlertClose = (timestamp: number): void => {
    this.setState(prevState => ({
      alerts: filter(
        complement(propEq('createdAtTimestamp', timestamp)),
        prevState.alerts,
      ),
    }));
  };

  makeDirectories = (): DirectoriesType => {
    const {
      languages,
      currencies,
      fiatCurrencies,
      cryptoCurrencies,
      sellerCurrencies,
      categories,
      orderStatuses,
      currencyExchange,
      countries,
    } = this.props;
    return {
      categories,
      languages,
      orderStatuses,
      currencies,
      fiatCurrencies,
      cryptoCurrencies,
      sellerCurrencies,
      currencyExchange,
      countries,
    };
  };

  render() {
    const {
      me,
      mainPage,
      cart,
      children,
      categories,
      relay: { environment },
    } = this.props;
    const { handleLogin } = this;
    const directories = this.makeDirectories();
    return (
      <AppContext.Provider
        // $FlowIgnoreMe
        value={{ categories, environment, directories, handleLogin }}
      >
        <Fragment>
          <AlertsContainer alerts={this.state.alerts} />
          <AlertContextProvider
            value={{
              addAlert: this.addAlert,
            }}
          >
            {children && React.cloneElement(children, { me, mainPage, cart })}
          </AlertContextProvider>
        </Fragment>
      </AppContext.Provider>
    );
  }
}

App.childContextTypes = {
  environment: PropTypes.object.isRequired,
  handleLogin: PropTypes.func,
  showAlert: PropTypes.func,
  directories: PropTypes.object,
  currentUser: currentUserShape,
};

export default createRefetchContainer(
  withRouter(App),
  graphql`
    fragment App_me on User {
      ...Profile_me
      ...ManageStoreMenu_me
      id
      rawId
      email
      firstName
      lastName
      avatar
      wizardStore {
        id
        completed
      }
      myStore {
        id
        rawId
      }
    }
  `,
  graphql`
    query App_me_Query {
      id
      me {
        ...App_me
      }
    }
  `,
);
