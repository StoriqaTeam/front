// @flow

import React, { Component } from 'react';
import Autocomplete from 'react-autocomplete';
import { isEmpty, pathOr, map, pick } from 'ramda';
import debounce from 'lodash.debounce';
import classNames from 'classnames';

import { AutocompleteInput } from 'components/Forms';

import './AutocompleteComponent.scss';


type PropsType = {
  autocompleteService: any,
  country: string,
  onSelect: Function,
  searchType: '(cities)' | 'geocode',
};

type StateType= {
  value: string,
  predictions: Array<{ mainText: string, secondaryText: string }>,
};

class AutocompleteComponent extends Component<PropsType, StateType> {
  render() {
    const { onChangeValue, onSelect, value, predictions } = this.props;
    return (
      <div styleName="wrapper">
        <Autocomplete
          autoHighlight
          id="someId"
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
              {...pick(['onChange', 'onBlur', 'onFocus', 'onKeyDown', 'onClick', 'value'], props)}
            />
          )}
          renderMenu={items => (
            <div styleName="items"><div styleName="itemsWrap" />{items}</div>
          )}
          onChange={e => onChangeValue(e.target.value)}
          value={value}
          onSelect={(selectedValue, item) => {
            onChangeValue(selectedValue);
            onSelect(selectedValue, item);
          }}
        />
      </div>
    );
  }
}

export default AutocompleteComponent;
