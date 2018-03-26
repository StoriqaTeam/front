// @flow
import React, { Component } from 'react';
import { forEach } from 'ramda';

import { AutocompleteComponent } from 'components/AddressAutocomplete';
import { MiniSelect } from 'components/MiniSelect';

import countries from './countries.json';
import { getIndexedCountries, getCountryByName } from './utils';

type PropsType = {
  autocompleteService: any,
  geocoderService: any,
}

type SelectType = {
  id: string,
  label: string,
}

type AutocompleteItemType = {
  mainText: string,
  secondaryText: string,
  place_id: string,
}

type StateType = {
  country: ?SelectType,
  address: ?any,
}

type GeocoderType = {
  address_components: Array<{ long_name: string, short_name: string, types: Array<string> }>,
  formatted_address: string,
  geometry: any,
  types: Array<string>,
  place_id: string,
}

const dataTypes = ['street_number', 'route', 'locality', 'administrative_area_level_2', 'administrative_area_level_1', 'country', 'postal_code'];

class AddressForm extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      country: null,
      address: null,
    };
  }

  handleOnReceiveAddress = (result: Array<GeocoderType>) => {
    const geocoderResult = result[0];
    if (geocoderResult && geocoderResult.address_components) {
      const address = {};
      const populateAddressField = (addressComponent) => {
        const type = addressComponent.types && Array.isArray(addressComponent.types)
          ? addressComponent.types[0]
          : null;
        if (type) {
          address[type] = addressComponent.long_name;
        }
      };
      forEach(populateAddressField, geocoderResult.address_components);
      this.setState({ address });
    }
  }

  handleOnSetAddress = (value: string, item: AutocompleteItemType) => {
    const { country } = this.state;
    const label = country ? country.label : '';
    const countryFromResource = getCountryByName(label, countries);
    const componentRestrictions = {
      country: countryFromResource ? countryFromResource.code : '',
    };
    this.props.geocoderService.geocode(
      {
        address: `${item.mainText}, ${item.secondaryText}`,
        componentRestrictions,
      },
      this.handleOnReceiveAddress,
    );
  }

  render() {
    const countriesArr = getIndexedCountries(countries);
    const { country, address } = this.state;
    const { autocompleteService } = this.props;
    const label = country ? country.label : '';
    const countryFromResource = getCountryByName(label, countries);
    const addressBlock = !label || !countryFromResource ? null : (
      <div>
        <AutocompleteComponent
          autocompleteService={autocompleteService}
          country={countryFromResource.code}
          searchType="geocode"
          onSelect={(value, item) => {
            this.handleOnSetAddress(value, item);
          }}
        />
      </div>
    );
    const autocompleteResult = address && (
      <div>
        {dataTypes.map(type => (
          <div>
            <input
              value={address[type]}
              key={type}
              style={{ margin: 6, padding: 5, border: '1px solid #333' }}
            />
          </div>
        ))}
      </div>
    );
    return (
      <div>
        <MiniSelect
          label="Select your country"
          items={countriesArr}
          onSelect={(value: ?SelectType) => {
            this.setState({ country: value });
          }}
          activeItem={this.state.country}
        />
        {addressBlock}
        {autocompleteResult}
      </div>
    );
  }
}


export default AddressForm;
