// @flow

import React, { PureComponent } from 'react';
import ReactAutocomplete from 'react-autocomplete';
import { pick, isEmpty } from 'ramda';

import { Input } from 'components/common/Input';

import './Autocomplete.scss';

type PropsType = {
  autocompleteItems: Array<string>,
  autocompleteValue: string,
  onChange: (value: string) => void,
  onSet: (value: string) => void,
  label: string,
  search?: boolean,
  fullWidth?: boolean,
};

class Autocomplete extends PureComponent<PropsType> {
  render() {
    const {
      autocompleteItems,
      autocompleteValue,
      label,
      search,
      fullWidth,
      onChange,
      onSet,
    } = this.props;
    return (
      <div className="container">
        <ReactAutocomplete
          autoHighlight
          id="autocompleteId"
          wrapperStyle={{ position: 'relative' }}
          items={autocompleteItems}
          getItemValue={item => item}
          renderItem={(item: any) => (
            <div key={item} styleName="item">
              {item}
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
          value={autocompleteValue}
          onChange={(e: any) => {
            onChange(e.target.value);
          }}
          onSelect={(selectedValue: string) => {
            onChange(selectedValue);
            onSet(selectedValue);
          }}
        />
      </div>
    );
  }
}

export default Autocomplete;
