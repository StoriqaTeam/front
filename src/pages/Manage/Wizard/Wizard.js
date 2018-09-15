// @flow strict

import * as React from 'react';

import { Main, FooterResponsive } from 'components/App';
import { CurrencyExchangesContext } from 'components/HOCs/CurrencyExchanges';

import type { CurrencyExchangesType } from 'components/HOCs/CurrencyExchanges';

import './Wizard.scss';

type PropsType = {
  me: ?{},
  ...CurrencyExchangesType,
  children: React.Element<*>,
};

const Wizard = (props: PropsType) => (
  <div styleName="container">
    <div styleName="headerMock" />
    <Main>
      <div styleName="wizardContainer">
        <CurrencyExchangesContext.Provider
          value={{ currencyExchange: props.currencyExchange }}
        >
          {React.cloneElement(props.children, { me: props.me })}
        </CurrencyExchangesContext.Provider>
      </div>
    </Main>
    <FooterResponsive />
  </div>
);

export default Wizard;
