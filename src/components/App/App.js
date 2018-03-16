// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createRefetchContainer, graphql } from 'react-relay';
import type { Environment } from 'relay-runtime';
import { log } from 'utils';

import { AddressAutocomplete } from 'components/AddressAutocomplete';
import { MiniSelect } from 'components/MiniSelect';
import countries from 'components/AddressAutocomplete/countries.json';
import { getIndexedCountries, getCountryByName } from './utils';

import Header from './Header';
import './App.scss';


type PropsType = {
  me: ?{},
  children: any,
  relay: {
    environment: Environment,
    refetch: Function,
  },
};

type StateType = {
  country: string,
}

class App extends Component<PropsType, StateType> {
  constructor(props) {
    super(props);
    this.state = {
      country: null,
    };
  }

  getChildContext() {
    return {
      environment: this.props.relay.environment,
      handleLogin: this.handleLogin,
    };
  }

  handleLogin = () => {
    this.props.relay.refetch({}, null, () => {}, { force: true });
  };

  render() {
    const { me, children } = this.props;
    const countriesArr = getIndexedCountries(countries);
    return (
      <div>
        <Header user={me} />
        {children && React.cloneElement(children, { me })}
        <br />
        <div style={{ width: '400px' }}>
          <MiniSelect
            label="Select your country"
            items={countriesArr}
            onSelect={(value) => {
              log.debug('**** on countries select: ', value, typeof id === 'string');
              this.setState({ country: value });
            }}
            activeItem={this.state.country}
          />
          <br />
          {this.state.country &&
            <div>
              <AddressAutocomplete
                country={getCountryByName(this.state.country.label, countries).Code}
                searchType="(cities)"
                onSelect={(value, item) => {
                  log.debug('search for sities: ', { value, item });
                }}
              />
              <br />
              <AddressAutocomplete
                country={getCountryByName(this.state.country.label, countries).Code}
                searchType="geocode"
                onSelect={(value, item) => {
                  log.debug('search for geocode: ', { value, item });
                }}
              />
            </div>
          }
        </div>
      </div>
    );
  }
}

App.childContextTypes = {
  environment: PropTypes.object.isRequired,
  handleLogin: PropTypes.func,
};

export default createRefetchContainer(
  App,
  graphql`
    fragment App_me on User {
      ...Profile_me
      id
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
