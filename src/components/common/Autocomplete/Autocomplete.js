// @flow

import React, { Component } from 'react';
import ReactAutocomplete from 'react-autocomplete';
import { pick, isEmpty } from 'ramda';
import classNames from 'classnames';
import debounce from 'lodash.debounce';

import { Input } from 'components/common/Input';

import './Autocomplete.scss';

type PropsType = {
  autocompleteItems: Array<{ id: string, label: string }>,
  onChange: (value: string) => void,
  onSet: (value: string) => void,
  label: string,
  search?: boolean,
  fullWidth?: boolean,
};

type StateType = {
  value: string,
};

class Autocomplete extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      value: '',
    };
    this.handleOnChange = debounce(this.handleOnChange, 250);
  }

  handleOnChangeInput = (value: string) => {
    this.setState(() => ({ value }), this.handleOnChange(value));
  };

  handleOnChange = (value: string) => {
    this.props.onChange(value);
  };

  handleOnSet = (value: string) => {
    this.setState(() => ({ value }), this.props.onSet(value));
  };

  render() {
    const { value } = this.state;
    const { autocompleteItems, label, search, fullWidth } = this.props;
    return (
      <div className="container">
        <ReactAutocomplete
          autoHighlight
          id="autocompleteId"
          wrapperStyle={{ position: 'relative' }}
          items={autocompleteItems}
          getItemValue={item => item.label}
          renderItem={(item, isHighlighted) => (
            <div
              key={item.id}
              styleName={classNames('item', { isHighlighted })}
            >
              {item.label}
            </div>
          )}
          renderInput={props => (
            <Input
              inputRef={props.ref}
              search={search}
              fullWidth={fullWidth}
              isAutocomplete
              label={label}
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
              id="autocompleteInput"
            />
          )}
          renderMenu={items => {
            if (isEmpty(items)) {
              return <div />;
            }
            return (
              <div styleName="items">
                <div styleName="itemsWrap">{items}</div>
              </div>
            );
          }}
          value={value}
          onChange={(e: any) => {
            this.handleOnChangeInput(e.target.value);
          }}
          onSelect={(selectedValue: string) => {
            this.handleOnSet(selectedValue);
          }}
        />
      </div>
    );
  }
}

export default Autocomplete;
