// @flow

import React, { Component, Fragment } from 'react';
import { map, prepend } from 'ramda';
import classNames from 'classnames';

import { Checkbox } from 'components/common';
import { Icon } from 'components/Icon';

type StateType = {
  countries: any,
};

type PropsType = {
  countries: any,
};

import './Countries.scss';

class Countries extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      countries: this.convertCountries(props.countries),
    };
  }

  componentDidUpdate(prevProps: PropsType) {
    const { countries } = this.props;
    if (JSON.stringify(prevProps.countries) !== JSON.stringify(countries)) {
      this.updateState(countries);
    }
  }

  handleOpenContinent = (code: string) => {
    this.setState((prevState: StateType) => {
      const newCountries = map(item => {
        if (code === item.alpha3) {
          return { ...item, isChecked: !item.isChecked };
        }
        return item;
      }, prevState.countries);
      return {
        countries: newCountries,
      };
    });
  };

  handleCheckCountry = (code: string) => {
    // this.setState((prevState: StateType) => {
    //   const newCountries = map(item => {
    //     if (code === item.alpha3) {
    //       return ({ ...item, isChecked: !item.isChecked });
    //     }
    //     return item;
    //   }, prevState.countries);
    //   return ({
    //     countries: newCountries,
    //   });
    // });
  };

  convertCountries = (countries: any) => {
    const newCountries = map(
      item => ({
        alpha3: item.alpha3,
        label: item.label,
        isChecked: false,
        children: map(
          child => ({
            alpha3: child.alpha3,
            label: child.label,
            isChecked: false,
          }),
          item.children,
        ),
      }),
      countries.children,
    );
    // console.log('---newCountries', newCountries);
    return newCountries;
  };

  setCheck = (countries: any, code?: string) => {
    let newCountries = [];
    if (!code) {
      newCountries = map(item => {
        const newChildren = map(
          child => ({ ...child, isCheck: !child.isCheck }),
          item.children,
        );
        return { ...item, children: newChildren };
      }, countries);
    } else {
      // тут по айдишнику надо затогглить нужную страну
    }
  };

  updateState = (countries: any) => {
    this.setState({ countries: this.convertCountries(countries) });
  };

  render() {
    const { countries } = this.state;
    // console.log('---countries', countries);
    return (
      <div styleName="container">
        {map(item => {
          return (
            <Fragment key={item.alpha3}>
              <div styleName="continent">
                <div styleName="checkbox">
                  <Checkbox id={`shipping-continent-${item.alpha3}`} />
                </div>
                <div
                  styleName="label"
                  onClick={() => {
                    this.handleOpenContinent(item.alpha3);
                  }}
                  onKeyDown={() => {}}
                  role="button"
                  tabIndex="0"
                >
                  <strong>{item.label}</strong>
                  <div
                    styleName={classNames('icon', {
                      rotateIcon: item.isChecked,
                    })}
                  >
                    <Icon type="arrowExpand" />
                  </div>
                </div>
              </div>
              <div
                styleName={classNames('continentsCountries', {
                  show: item.isChecked,
                })}
              >
                {map(country => {
                  console.log('---country', country);
                  return (
                    <div key={country.alpha3} styleName="country">
                      <div styleName="checkbox">
                        <Checkbox
                          id={`shipping-country-${country.alpha3}`}
                          label={country.label}
                          onChange={() => {
                            this.handleCheckCountry(item.alpha3);
                          }}
                        />
                      </div>
                    </div>
                  );
                }, item.children)}
              </div>
            </Fragment>
          );
        }, countries)}
      </div>
    );
  }
}

export default Countries;
