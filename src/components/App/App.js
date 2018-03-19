// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createRefetchContainer, graphql } from 'react-relay';
import type { Environment } from 'relay-runtime';
import { log } from 'utils';


import { GoogleAPIWrapper, AutocompleteComponent } from 'components/AddressAutocomplete';
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

type SelectType = {
  id: string,
  label: string,
}

type AddressType = {
  country: string,
  region: ?string,
  city: string,
}

type StateType = {
  country: ?SelectType,
  address: ?AddressType,
}

class App extends Component<PropsType, StateType> {
  constructor(props) {
    super(props);
    this.state = {
      country: null,
      address: null,
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

  handleOnSetCity = (item) => {
    this.setState({
      address: {
        country: item.terms[item.terms.length - 1].value,
        region: item.terms.length === 3 ? item.terms[item.terms.length - 2].value : undefined,
        city: item.terms[0].value,
      },
    });
  }

  handleOnSetAddress = (item) => {
    console.log('**** handleOnSetAddress: ', item);
  }

  render() {
    const { me, children } = this.props;
    const { country, address } = this.state;
    const countriesArr = getIndexedCountries(countries);
    const label = country ? country.label : '';
    // console.log('%%% address: ', address);
    const addressBlock = !label ? null : (
      <div>
        <GoogleAPIWrapper>
          <div>
            <AutocompleteComponent
              country={getCountryByName(label, countries).Code}
              searchType="(cities)"
              onSelect={(item) => {
                log.debug('search for sities: ', { item });
                this.handleOnSetCity(item);
              }}
            />
            <br />
            <AutocompleteComponent
              country={getCountryByName(label, countries).Code}
              searchType="geocode"
              onSelect={(item) => {
                log.debug('search for geocode: ', { item });
                this.handleOnSetAddress(item);
              }}
            />
          </div>
        </GoogleAPIWrapper>
        <br />
      </div>
    );
    // if (navigator.geolocation) {
    //   navigator.geolocation.getCurrentPosition((position) => {
    //     // console.log('**** geolocation: ', position);
    //     // var lat = position.coords.latitude;
    //     // var lng = position.coords.longitude;
    //     // codeLatLng(lat, lng);
    //   }, () => {
    //     // console.log('**** geolocation error: ');
    //   });
    // }
    return (
      <div>
        <Header user={me} />
        {children && React.cloneElement(children, { me })}
        <br />
        <div style={{ width: '400px' }}>
          <MiniSelect
            label="Select your country"
            items={countriesArr}
            onSelect={(value: ?SelectType) => {
              log.debug('**** on countries select: ', value);
              this.setState({ country: value });
            }}
            activeItem={this.state.country}
          />
          <br />
          {addressBlock }
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
