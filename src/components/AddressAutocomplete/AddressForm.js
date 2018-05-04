// @flow
import React, { Component } from 'react';
import { pick, pathOr, forEach, isEmpty, map } from 'ramda';
import Autocomplete from 'react-autocomplete';
import classNames from 'classnames';

import { Select } from 'components/common/Select';
import debounce from 'lodash.debounce';
import { AutocompleteInput } from 'components/common/AutocompleteInput';
import { renameCamelCase } from 'utils';

import googleApiWrapper from './GoogleAPIWrapper';
import AddressResultForm from './AddressResultForm';
import countries from './countries.json';
import { getIndexedCountries, getCountryByName } from './utils';

import './AddressForm.scss';

type AutocompleteItemType = {
  mainText: string,
  secondaryText: string,
  place_id: string,
};

type PropsType = {
  autocompleteService: any,
  geocoderService: any,
  onChangeFormInput: (type: string) => (e: any) => void,
  onUpdateForm: (form: any) => void,
};

type SelectType = {
  id: string,
  label: string,
};

type StateType = {
  country: SelectType,
  address: ?any,
  autocompleteValue: ?string,
  predictions: Array<{ mainText: string, secondaryText: string }>,
};

type GeocoderType = {
  addressComponents: Array<{
    long_name: string,
    short_name: string,
    types: Array<string>,
  }>,
  formattedAddress: string,
  geometry: any,
  types: Array<string>,
  placeId: string,
};

class Form extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      country: null,
      address: null,
      autocompleteValue: null,
      predictions: [],
    };
    this.handleAutocomplete = debounce(this.handleAutocomplete, 250);
  }

  handleOnReceiveAddress = (result: GeocoderType) => {
    const { onUpdateForm } = this.props;
    if (result && result.addressComponents) {
      const address = {};
      const populateAddressField = addressComponent => {
        const type =
          addressComponent.types && Array.isArray(addressComponent.types)
            ? addressComponent.types[0]
            : null;
        if (type) {
          address[type] = addressComponent.long_name;
        }
      };
      forEach(populateAddressField, result.addressComponents);
      this.setState({ address });
      onUpdateForm(address);
    }
  };

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
      (result: any) => {
        this.handleOnReceiveAddress(renameCamelCase(result[0]));
      },
    );
  };

  handleOnChangeForm = (type: string) => (e: any) => {
    const { onChangeFormInput } = this.props;
    onChangeFormInput(type)(e);
    this.setState({
      address: {
        ...this.state.address,
        [type]: e.target.value,
      },
    });
  };

  handleSearch = (predictions: any, status: string) => {
    /* eslint-disable */
    // $FlowIgnore
    if (status !== google.maps.places.PlacesServiceStatus.OK) {
      return;
    }
    /* eslint-enable */
    const formattedResult = map(
      item => ({
        mainText: pathOr(null, ['structured_formatting', 'main_text'], item),
        secondaryText: pathOr(
          null,
          ['structured_formatting', 'secondary_text'],
          item,
        ),
        ...pick(['place_id'], item),
      }),
      predictions,
    );
    this.setState({ predictions: formattedResult });
  };

  handleAutocomplete = (value: string) => {
    const { autocompleteService } = this.props;
    const { country } = this.state;
    const label = country ? country.label : '';
    const countryFromResource = getCountryByName(label, countries);
    if (isEmpty(value)) {
      this.setState({ predictions: [] });
      return;
    }
    const inputObj = {
      input: value,
      componentRestrictions: {
        country: countryFromResource ? countryFromResource.code : '',
      },
      types: ['geocode'],
    };
    autocompleteService.getPlacePredictions(inputObj, this.handleSearch);
  };

  handleOnChangeAddress = (value: string) => {
    this.setState({ autocompleteValue: value });
    this.handleAutocomplete(value);
  };

  render() {
    const { country, address, autocompleteValue, predictions } = this.state;
    const countriesArr = getIndexedCountries(countries);
    const label = country ? country.label : '';
    const countryFromResource = getCountryByName(label, countries);
    const addressBlock =
      !label || !countryFromResource ? null : (
        <div styleName="wrapper">
          <Autocomplete
            autoHighlight
            id="autocompleteId"
            wrapperStyle={{ position: 'relative' }}
            items={predictions}
            getItemValue={item => item.mainText}
            renderItem={(item, isHighlighted) => (
              <div
                key={`${item.mainText}-${item.secondaryText}`}
                styleName={classNames('item', { isHighlighted })}
              >
                {`${item.mainText}, ${item.secondaryText}`}
              </div>
            )}
            renderInput={props => (
              <AutocompleteInput
                inputRef={props.ref}
                label="Address"
                {...pick(
                  [
                    'onChange',
                    'onBlur',
                    'onFocus',
                    'onKeyDown',
                    'onClick',
                    'value',
                  ],
                  props,
                )}
              />
            )}
            renderMenu={items => (
              <div styleName="items">
                <div styleName="itemsWrap" />
                {items}
              </div>
            )}
            value={autocompleteValue}
            onChange={e => this.handleOnChangeAddress(e.target.value)}
            onSelect={(selectedValue, item) => {
              this.handleOnChangeAddress(selectedValue);
              this.handleOnSetAddress(selectedValue, item);
            }}
          />
        </div>
      );
    const autocompleteResult = address && (
      <AddressResultForm
        onChangeForm={this.handleOnChangeForm}
        address={address}
      />
    );
    return (
      <div>
        <div styleName="wrapper">
          <Select
            forForm
            label="Country"
            items={countriesArr}
            onSelect={(value: ?SelectType) => {
              this.setState({
                country: value,
                address: null,
                autocompleteValue: '',
                predictions: [],
              });
            }}
            activeItem={this.state.country}
            dataTest="AddressFormSelect"
          />
          <div styleName="wrapper">{addressBlock}</div>
        </div>
        {autocompleteResult}
      </div>
    );
  }
}

const AddressForm = googleApiWrapper(Form);

export default AddressForm;
