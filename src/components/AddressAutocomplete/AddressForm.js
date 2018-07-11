// @flow
import React, { Component } from 'react';
import {
  any,
  pick,
  pathOr,
  forEach,
  isEmpty,
  map,
  find,
  omit,
  isNil,
} from 'ramda';
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

export type AddressFullType = {
  value?: ?string,
  country?: ?string,
  administrativeAreaLevel1?: ?string,
  administrativeAreaLevel2?: ?string,
  locality?: ?string,
  political?: ?string,
  postalCode?: ?string,
  route?: ?string,
  streetNumber?: ?string,
  placeId?: ?string,
};

type PropsType = {
  autocompleteService: any,
  geocoderService: any,
  onChangeFormInput: (type: string) => (e: any) => void,
  onUpdateForm: (form: any) => void,
  onChangeData: (data: any) => void,
  country: string,
  address: string,
  addressFull: AddressFullType,
  isOpen?: boolean,
};

type SelectType = {
  id: string,
  label: string,
};

type StateType = {
  country: ?SelectType,
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
  static getDerivedStateFromProps(nextProps, prevState) {
    const country = find(
      item =>
        item.name === nextProps.country || item.code === nextProps.country,
    )(countries);
    const propsCountry = country
      ? { id: country.code, label: country.name }
      : null;
    const uneqCountry =
      JSON.stringify(propsCountry) !== JSON.stringify(prevState.country);

    const address =
      !isNil(nextProps.addressFull) &&
      any(val => !isNil(val))(Object.values(nextProps.addressFull))
        ? omit(['country', 'value'], nextProps.addressFull)
        : null;
    const uneqAddress =
      JSON.stringify(address) !== JSON.stringify(prevState.address);

    const autocompleteValue = nextProps.address;
    const uneqAutocompleteValue =
      autocompleteValue !== prevState.autocompleteValue;

    return {
      ...prevState,
      country: uneqCountry ? propsCountry : prevState.country,
      address: uneqAddress ? address : prevState.address,
      autocompleteValue: uneqAutocompleteValue
        ? autocompleteValue
        : prevState.autocompleteValue,
    };
  }

  constructor(props: PropsType) {
    super(props);
    const country = find(
      item => item.name === props.country || item.code === props.country,
    )(countries);
    this.state = {
      country: country ? { id: country.code, label: country.name } : null,
      address:
        !isNil(props.addressFull) &&
        any(val => !isNil(val))(Object.values(props.addressFull))
          ? omit(['country', 'value'], props.addressFull)
          : null,
      autocompleteValue: props.address,
      predictions: [],
    };
    this.handleAutocomplete = debounce(this.handleAutocomplete, 250);
  }

  handleOnReceiveAddress = (result: GeocoderType) => {
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
      this.setState({ address: renameCamelCase(address) }, () =>
        this.handleOnChangeData(),
      );
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
    if (onChangeFormInput) {
      onChangeFormInput(type)(e);
    }
    this.setState(
      {
        address: {
          ...this.state.address,
          [type]: e.target.value,
        },
      },
      () => this.handleOnChangeData(),
    );
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
    const { autocompleteService, onUpdateForm } = this.props;
    const { country } = this.state;
    const label = country ? country.label : '';
    const countryFromResource = getCountryByName(label, countries);
    if (onUpdateForm) {
      onUpdateForm({ value });
    }
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
    this.setState(
      () => ({ autocompleteValue: value }),
      () => this.handleOnChangeData(),
    );
    this.handleAutocomplete(value);
  };

  handleOnChangeCountry = (value: ?SelectType) => {
    const { onUpdateForm } = this.props;
    this.setState(
      () => ({ country: value }),
      () => {
        if (onUpdateForm) {
          onUpdateForm({ country: value ? value.label : '' });
        }
        this.handleOnChangeData();
      },
    );
  };

  handleOnChangeData = () => {
    const { onChangeData } = this.props;
    const { address, country, autocompleteValue } = this.state;
    if (onChangeData && address) {
      // $FlowIgnore
      onChangeData({
        ...pick(
          [
            'value',
            'country',
            'administrativeAreaLevel1',
            'administrativeAreaLevel2',
            'locality',
            'political',
            'postalCode',
            'route',
            'streetNumber',
            'placeId',
          ],
          address,
        ),
        country: country ? country.label : null,
        value: autocompleteValue,
      });
    }
  };

  render() {
    const { isOpen } = this.props;
    const { country, address, autocompleteValue, predictions } = this.state;
    const countriesArr = getIndexedCountries(countries);
    const countryLabel = country ? country.label : '';
    const countryFromResource = getCountryByName(countryLabel, countries);
    const addressBlock = (countryFromResource || countryLabel || isOpen) && (
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
    const autocompleteResult = (address || isOpen) && (
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
            fullWidth
            label="Country"
            items={countriesArr}
            onSelect={this.handleOnChangeCountry}
            activeItem={this.state.country}
            dataTest="AddressFormSelect"
          />
          <div styleName="result">{addressBlock}</div>
        </div>
        {autocompleteResult}
      </div>
    );
  }
}

const AddressForm = googleApiWrapper(Form);

export default AddressForm;
