// @flow

import React, { Component, Fragment } from 'react';
import { map, find, whereEq, propOr } from 'ramda';

import { CurrencyExchangesContext } from 'components/HOCs/CurrencyExchanges';
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
      <CurrencyExchangesContext.Consumer>
        {({ currencyExchange }) => {
          const currentCurrency = getCookie('CURRENCY');
          if (!currentCurrency) {
            return null;
          }

          const priceElement = this.props.renderPrice({
            price: this.props.price,
            currencyCode: currentCurrency,
          });

          const arr = Array(...(currencyExchange || []));
          const currentCurrencyRates = find(
            whereEq({ code: currentCurrency }),
            arr,
          );
          const values = map(
            (item: {
              code: string,
              value: number,
            }): {
              currencyCode: string,
              value: number,
            } => ({
              currencyCode: item.code,
              value: this.props.price / item.value,
            }),
            // $FlowIgnoreMe
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
                              // $FlowIgnoreMe
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
                  // $FlowIgnoreMe
                  this.props.renderDropdown(values)}
              </div>
            </Fragment>
          );
        }}
      </CurrencyExchangesContext.Consumer>
    );
  }
}

export default MultiCurrencyDropdown;
