// @flow

import React, { Component, Fragment } from 'react';
import { map, forEach } from 'ramda';
import classNames from 'classnames';

import { Checkbox } from 'components/common';
import { Icon } from 'components/Icon';

import { convertCountriesForSelect, convertCountriesToArrCodes } from './utils';

import type {
  ShippingCountriesType,
  FilledCompanyType,
  CountryType,
} from './types';

import './Countries.scss';

type StateType = {
  countries: ?ShippingCountriesType,
};

type PropsType = {
  countries: ?ShippingCountriesType,
  onChange: (countries: ?ShippingCountriesType) => void,
  company?: FilledCompanyType,
};

class Countries extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    const { countries, company } = props;
    const countriesForSelect = !company
      ? convertCountriesForSelect({ countries })
      : convertCountriesForSelect({
          countries,
          checkedCountries: convertCountriesToArrCodes({
            countries: company.countries,
          }),
        });
    this.state = {
      countries: countriesForSelect,
    };
    props.onChange(countriesForSelect);
  }

  componentDidUpdate(prevProps: PropsType) {
    const { countries } = this.props;
    if (JSON.stringify(prevProps.countries) !== JSON.stringify(countries)) {
      this.updateState(countries);
    }
  }

  handleOpenContinent = (code: string) => {
    this.setState((prevState: StateType) => {
      const { countries } = prevState;
      const newChildren = map(item => {
        if (code === item.alpha3) {
          return { ...item, isOpen: !item.isOpen };
        }
        return { ...item, isOpen: false };
      }, countries && countries.children ? countries.children : []);
      return {
        countries: { ...prevState.countries, children: newChildren },
      };
    });
  };

  handleCheckContinent = (code: string) => {
    this.setState(
      (prevState: StateType) => {
        const { countries } = prevState;
        let isSelectedAll = true;
        const newChildren = map(item => {
          if (code === item.alpha3) {
            if (!item.isSelected) {
              const newItem = {
                ...item,
                children: map(
                  child => ({ ...child, isSelected: true }),
                  item.children,
                ),
              };
              return { ...newItem, isSelected: true };
            }
            isSelectedAll = false;
            const newItem = {
              ...item,
              children: map(
                child => ({ ...child, isSelected: false }),
                item.children,
              ),
            };
            return { ...newItem, isSelected: false };
          }
          forEach(child => {
            if (!child.isSelected) {
              isSelectedAll = false;
            }
          }, item.children);
          return item;
        }, countries && countries.children ? countries.children : []);
        return {
          countries: {
            ...prevState.countries,
            children: newChildren,
            isSelected: isSelectedAll,
          },
        };
      },
      () => {
        this.props.onChange(this.state.countries);
      },
    );
  };

  handleCheckCountry = (country: CountryType) => {
    this.setState(
      (prevState: StateType) => {
        const { countries } = prevState;
        let isSelectedAll = true;
        const newChildren = map(continent => {
          if (country.parent === continent.alpha3) {
            let isSelected = false;
            const children = map(child => {
              if (country.alpha3 === child.alpha3) {
                if (!child.isSelected) {
                  isSelected = true;
                } else {
                  isSelectedAll = false;
                }
                return { ...child, isSelected: !child.isSelected };
              }
              if (child.isSelected) {
                isSelected = true;
              } else {
                isSelectedAll = false;
              }
              return child;
            }, continent.children);
            return { ...continent, children, isSelected };
          }
          forEach(child => {
            if (!child.isSelected) {
              isSelectedAll = false;
            }
          }, continent.children);
          return continent;
        }, countries && countries.children ? countries.children : []);
        return {
          countries: {
            ...prevState.countries,
            children: newChildren,
            isSelected: isSelectedAll,
          },
        };
      },
      () => {
        this.props.onChange(this.state.countries);
      },
    );
  };

  handleCheckAll = () => {
    this.setState(
      (prevState: StateType) => {
        const { countries } = prevState;
        return {
          countries: convertCountriesForSelect({
            countries: prevState.countries,
            isSelected: countries ? !countries.isSelected : false,
          }),
        };
      },
      () => {
        this.props.onChange(this.state.countries);
      },
    );
  };

  updateState = (countries: ?ShippingCountriesType) => {
    const { company } = this.props;
    this.setState(
      {
        countries: !company
          ? convertCountriesForSelect({ countries })
          : convertCountriesForSelect({
              countries,
              checkedCountries: convertCountriesToArrCodes({
                countries: company.countries,
              }),
            }),
      },
      () => {
        this.props.onChange(this.state.countries);
      },
    );
  };

  render() {
    const { company } = this.props;
    const { countries } = this.state;
    if (!countries) {
      return null;
    }
    return (
      <div styleName="container">
        <div styleName="checkbox allCheckbox">
          <Checkbox
            id={`shipping-${company ? 'company' : ''}all-countries`}
            label="Select all"
            isChecked={countries.isSelected}
            onChange={this.handleCheckAll}
          />
        </div>
        {map(
          item => (
            <Fragment key={item.alpha3}>
              <div styleName="continent">
                <div styleName="checkbox">
                  <Checkbox
                    id={`shipping-${company ? 'company' : ''}continent-${
                      item.alpha3
                    }`}
                    isChecked={item.isSelected}
                    onChange={() => {
                      this.handleCheckContinent(item.alpha3);
                    }}
                  />
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
                      rotateIcon: item.isOpen,
                    })}
                  >
                    <Icon type="arrowExpand" />
                  </div>
                </div>
              </div>
              <div
                styleName={classNames('continentsCountries', {
                  show: item.isOpen,
                })}
              >
                {map(
                  country => (
                    <div key={country.alpha3} styleName="country">
                      <div styleName="checkbox">
                        <Checkbox
                          id={`shipping-${company ? 'company' : ''}country-${
                            country.alpha3
                          }`}
                          label={country.label}
                          isChecked={country.isSelected}
                          onChange={() => {
                            this.handleCheckCountry(country);
                          }}
                        />
                      </div>
                    </div>
                  ),
                  item.children,
                )}
              </div>
            </Fragment>
          ),
          countries.children,
        )}
      </div>
    );
  }
}

export default Countries;
