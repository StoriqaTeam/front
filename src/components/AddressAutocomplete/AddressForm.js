// @flow
import React, { Component } from 'react';
import { forEach } from 'ramda';

import { AutocompleteComponent } from 'components/AddressAutocomplete';
import { MiniSelect } from 'components/MiniSelect';
import { Input } from 'components/Forms';

import googleApiWrapper from './GoogleAPIWrapper';
import countries from './countries.json';
import { getIndexedCountries, getCountryByName } from './utils';


type PropsType = {
  autocompleteService: any,
  geocoderService: any,
  onChangeFormInput: (type: string) => (e: any) => void,
  onUpdateForm: (form: any) => void,
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

class Form extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      country: null,
      address: null,
    };
  }

  handleOnReceiveAddress = (result: Array<GeocoderType>) => {
    const { onUpdateForm } = this.props;
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
      onUpdateForm(address);
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

  handleOnChangeForm = (type: string) => (e: any) => {
    const { onChangeFormInput } = this.props;
    onChangeFormInput(type)(e);
    this.setState({
      address: {
        ...this.state.address,
        [type]: e.target.value,
      },
    });
  }

  render() {
    const countriesArr = getIndexedCountries(countries);
    const { country, address } = this.state;
    const { autocompleteService } = this.props;
    const label = country ? country.label : '';
    const countryFromResource = getCountryByName(label, countries);
    const addressBlock = !label || !countryFromResource ? null : (
      <AutocompleteComponent
        autocompleteService={autocompleteService}
        country={countryFromResource.code}
        searchType="geocode"
        onSelect={(value, item) => {
          this.handleOnSetAddress(value, item);
        }}
      />
    );
    const autocompleteResult = address && (
      <div>
        {dataTypes.map(type => (
          <div
            key={type}
          >
            <Input
              id={type}
              label={type}
              onChange={this.handleOnChangeForm(type)}
              value={address[type]}
              limit={50}
            />
          </div>
        ))}
      </div>
    );
    return (
      <div>
        <MiniSelect
          forForm
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

const AddressForm = googleApiWrapper(Form);

export default AddressForm;
