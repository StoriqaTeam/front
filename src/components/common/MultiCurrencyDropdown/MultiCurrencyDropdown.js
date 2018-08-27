// @flow

import React, { Component, Fragment } from 'react';
import { map, find, whereEq } from 'ramda';

import { AppContext } from 'components/App';
import { getCookie } from 'utils';

import type { Node, Element } from 'react';

type PropsType = {
  price: number,
  renderPrice: ({ price: number, currencyCode: string }) => Node, // refactor currencyCode type with enum
  renderDropdown: (Array<{ currencyCode: string, value: number }>) => Node, // refactor currencyCode type with
  dropdownToggle: Element<*>,
};

type StateType = {
  isDropdownShown: boolean,
};

class MultiCurrencyDropdown extends Component<PropsType, StateType> {
  state: StateType = {
    isDropdownShown: false,
  };

  render() {
    return (
      <AppContext.Consumer>
        {({ directories: { currencyExchange } }) => {
          const currentCurrency = getCookie('CURRENCY');
          if (!currentCurrency) {
            return null;
          }

          const priceElement = this.props.renderPrice({
            price: this.props.price,
            currencyCode: currentCurrency.code,
          });

          const currentCurrencyRates = find(
            whereEq({ code: currentCurrency.code }),
            currencyExchange,
          );
          const values = map(
            (item: { code: string, rate: number }) => ({
              currencyCode: item.code,
              value: this.props.price * item.rate,
            }),
            currentCurrencyRates,
          );

          return (
            <Fragment>
              <div>
                {priceElement}
                {React.cloneElement(this.props.dropdownToggle, {
                  onClick: () => {
                    this.setState(prevState => ({
                      isDropdownShown: !prevState.isDropdownShown,
                    }));
                  },
                })}
              </div>
              {this.state.isDropdownShown && this.props.renderDropdown(values)}
            </Fragment>
          );
        }}
      </AppContext.Consumer>
    );
  }
}

export default MultiCurrencyDropdown;
