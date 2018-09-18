// @flow

import React, { Component, Fragment } from 'react';
import { map, forEach, isEmpty } from 'ramda';
import classNames from 'classnames';

import { Checkbox } from 'components/common';
import { Icon } from 'components/Icon';

import { convertCountriesForSelect, convertCountriesToArrCodes } from './utils';

import './Countries.scss';

type StateType = {
  countries: any,
};

type PropsType = {
  countries: any,
  onChange: any,
  company: any,
};

class Countries extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    const { countries, company } = props;
    // console.log('---company', company);
    const countriesForSelect = !company
      ? convertCountriesForSelect({ countries })
      : convertCountriesForSelect({
          countries,
          checkedCountries: convertCountriesToArrCodes(company.countries),
        });
    this.state = {
      countries: countriesForSelect,
      // arrangeChecked(countries, convertCountriesToArrCodes(company.countries))
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
      const newChildren = map(item => {
        if (code === item.alpha3) {
          return { ...item, isOpen: !item.isOpen };
        }
        return { ...item, isOpen: false };
      }, prevState.countries.children);
      return {
        countries: { ...prevState.countries, children: newChildren },
      };
    });
  };

  handleCheckContinent = (code: string) => {
    this.setState(
      (prevState: StateType) => {
        let isCheckedAll = true;
        const newChildren = map(item => {
          if (code === item.alpha3) {
            if (!item.isChecked) {
              const newItem = {
                ...item,
                children: map(child => {
                  return { ...child, isChecked: true };
                }, item.children),
              };
              return { ...newItem, isChecked: true };
            }
            isCheckedAll = false;
            const newItem = {
              ...item,
              children: map(child => {
                return { ...child, isChecked: false };
              }, item.children),
            };
            return { ...newItem, isChecked: false };
          }
          forEach(child => {
            if (!child.isChecked) {
              isCheckedAll = false;
            }
          }, item.children);
          return item;
        }, prevState.countries.children);
        return {
          countries: {
            ...prevState.countries,
            children: newChildren,
            isChecked: isCheckedAll,
          },
        };
      },
      () => {
        this.props.onChange(this.state.countries);
      },
    );
  };

  handleCheckCountry = (country: any) => {
    this.setState(
      (prevState: StateType) => {
        let isCheckedAll = true;
        const newChildren = map(item => {
          if (country.parent === item.alpha3) {
            let isChecked = false;
            const children = map(child => {
              if (country.alpha3 === child.alpha3) {
                if (!child.isChecked) {
                  isChecked = true;
                } else {
                  isCheckedAll = false;
                }
                return { ...child, isChecked: !child.isChecked };
              }
              if (child.isChecked) {
                isChecked = true;
              } else {
                isCheckedAll = false;
              }
              return child;
            }, item.children);
            return { ...item, children, isChecked };
          }
          forEach(child => {
            if (!child.isChecked) {
              isCheckedAll = false;
            }
          }, item.children);
          return item;
        }, prevState.countries.children);
        return {
          countries: {
            ...prevState.countries,
            children: newChildren,
            isChecked: isCheckedAll,
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
        return {
          countries: convertCountriesForSelect({
            countries: prevState.countries,
            isChecked: !prevState.countries.isChecked,
          }),
        };
      },
      () => {
        this.props.onChange(this.state.countries);
      },
    );
  };

  updateState = (countries: any) => {
    const { company } = this.props;
    this.setState(
      {
        countries: !company
          ? convertCountriesForSelect({ countries })
          : convertCountriesForSelect({
              countries,
              checkedCountries: convertCountriesToArrCodes(company.countries),
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
    if (isEmpty(countries)) {
      return null;
    }
    return (
      <div styleName="container">
        <div styleName="checkbox allCheckbox">
          <Checkbox
            id={`shipping-${company ? 'company' : ''}all-countries`}
            label="Select all"
            isChecked={countries.isChecked}
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
                    isChecked={item.isChecked}
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
                          isChecked={country.isChecked}
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
