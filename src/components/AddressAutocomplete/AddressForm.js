// @flow
import React, { Component } from 'react';
import { AutocompleteComponent } from 'components/AddressAutocomplete';
import { MiniSelect } from 'components/MiniSelect';
import { log } from 'utils';
import { find, any, forEach } from 'ramda';
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

const dataTypes = ['street_number', 'route', 'locality', 'administrative_area_level_2', 'administrative_area_level_1', 'country', 'postal_code'];

class AddressForm extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      country: null,
      address: null,
    };
  }

  handleOnReceiveAddress = (result: any) => {
    const geocoderResult = result[0];
    if (geocoderResult && geocoderResult.address_components) {
      const address = {};
      const populateAddressField = (addressComponent) => {
        address[addressComponent.types[0]] = addressComponent.long_name;
      };
      forEach(populateAddressField, geocoderResult.address_components);
      this.setState({ address });
    }
  }

  handleOnSetAddress = (value: string, item: AutocompleteItemType) => {
    // console.log('**** handleOnSetAddress: ', { value, item });
    const { country } = this.state;
    const label = country ? country.label : '';
    const componentRestrictions = {
      country: getCountryByName(label, countries).Code,
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
    const addressBlock = !label ? null : (
      <div>
        <AutocompleteComponent
          autocompleteService={autocompleteService}
          country={getCountryByName(label, countries).Code}
          searchType="geocode"
          onSelect={(value, item) => {
            this.handleOnSetAddress(value, item);
          }}
        />
      </div>
    );
    const autocompleteResult = (
      <div>
        {address && dataTypes.map(type => (
          <div>
            <input value={address[type]} key={address[type]} style={{ margin: 6, padding: 5, border: '1px solid #333' }} />
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
            log.debug('**** on countries select: ', value);
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
