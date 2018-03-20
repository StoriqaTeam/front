// @flow

import React, { Component } from 'react';
import Autocomplete from 'react-autocomplete';
import { isEmpty, pathOr, map, pick } from 'ramda';
import debounce from 'lodash.debounce';
import { log } from 'utils';


type PropsType = {
  autocompleteService: any,
  country: string,
  onSelect: Function,
  searchType: '(cities)' | 'geocode',
};

type StateType= {
  value: string,
  predictions: Array<{ mainText: string, secondaryText: '' }>,
};

class AutocompleteComponent extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.handleInputChange = debounce(this.handleInputChange, 250);
  }

  state: StateType = {
    value: '',
    predictions: [],
  };

  handleSearch = (predictions: any, status: string) => {
    /* eslint-disable */
    // $FlowIgnore
    if (status !== google.maps.places.PlacesServiceStatus.OK) {
      return;
    }
    /* eslint-enable */
    // console.log('%%%% predic: ', predictions);
    const formattedResult = map(item => ({
      mainText: pathOr(null, ['structured_formatting', 'main_text'], item),
      secondaryText: pathOr(null, ['structured_formatting', 'secondary_text'], item),
      ...pick(['place_id'], item),
    }), predictions);
    this.setState({ predictions: formattedResult });
  };

  handleInputChange = (value: string) => {
    if (isEmpty(value)) {
      this.setState({ predictions: [] });
      return;
    }
    log.debug('***** value', { value });
    /* eslint-disable */
    // $FlowIgnore
    this.props.autocompleteService.getPlacePredictions(
    /* eslint-enable */
      {
        input: value,
        componentRestrictions: {
          country: this.props.country,
        },
        types: this.props.searchType ? [this.props.searchType] : null,
      },
      this.handleSearch,
    );
  };

  render() {
    return (
      <Autocomplete
        id="someId"
        items={this.state.predictions}
        getItemValue={item => item.mainText}
        renderItem={item => (
          <div key={`${item.mainText}-${item.secondaryText}`}>
            {`${item.mainText}, ${item.secondaryText}`}
          </div>
        )}
        renderInput={props => (<input {...props} style={{ border: 'red 1px solid' }} />)}
        onChange={(e) => {
          const { value } = e.target;
          this.setState({ value });
          this.handleInputChange(value);
        }}
        value={this.state.value}
        onSelect={(value, item) => {
          this.setState({ value });
          this.props.onSelect(value, item);
        }}
      />
    );
  }
}

export default AutocompleteComponent;
