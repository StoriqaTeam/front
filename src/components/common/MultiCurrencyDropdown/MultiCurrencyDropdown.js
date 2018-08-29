// @flow

import React, { Component, Fragment } from 'react';
import { map, find, whereEq, propOr, equals } from 'ramda';

import { AppContext } from 'components/App';
import { getCookie } from 'utils';

import type { Node, Element } from 'react';

type PropsType = {
  price: number,
  renderPrice: ({ price: number, currencyCode: string }) => Node, // refactor currencyCode type with enum
  renderDropdown: (
    rates: Array<{ currencyCode: string, value: number }>,
  ) => Node,
  renderDropdownToggle: (isDropdownOpened: boolean) => Element<*>,
  onDropdownToggleClick?: (
    e: any,
    rates: Array<{ currencyCode: string, value: number }>,
    isDropdownShown: boolean,
  ) => void,
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
            currencyCode: currentCurrency,
          });

          const currentCurrencyRates = find(
            whereEq({ code: currentCurrency }),
            currencyExchange,
          );
          const values = map(
            (item: { code: string, value: number }) => ({
              currencyCode: item.code,
              value: this.props.price / item.value,
            }),
            propOr([], 'rates', currentCurrencyRates),
          );

          return (
            <Fragment>
              <div>
                {priceElement}
                {React.cloneElement(
                  this.props.renderDropdownToggle(this.state.isDropdownShown),
                  {
                    onClick: (e: any) => {
                      e.persist();
                      e.preventDefault();
                      e.stopPropagation();
                      e.nativeEvent.stopImmediatePropagation();
                      this.setState(
                        prevState => ({
                          isDropdownShown: !prevState.isDropdownShown,
                        }),
                        () => {
                          if (this.props.onDropdownToggleClick) {
                            this.props.onDropdownToggleClick(
                              e,
                              values,
                              this.state.isDropdownShown,
                            );
                          }
                        },
                      );
                    },
                  },
                )}
                {this.state.isDropdownShown &&
                  this.props.renderDropdown(values)}
              </div>
            </Fragment>
          );
        }}
      </AppContext.Consumer>
    );
  }
}

export default MultiCurrencyDropdown;
