// @flow

import React, { Component } from 'react';
import Autocomplete from 'react-autocomplete';
import { filter, startsWith, toUpper } from 'ramda';
import classNames from 'classnames';

import { log } from 'utils';

import SearchIcon from './svg/search.svg';
import './SearchInput.scss';

type PropsType = {
  //
};

type StateType = {
  inputValue: string,
  items: Array<any>,
  checkedDropdownItemId: ?number,
};

const data: Array<{id: number, label: string}> = [
  { id: 1, label: 'Стол' },
  { id: 2, label: 'Стол письменный' },
  { id: 3, label: 'Стол журнальный' },
  { id: 4, label: 'Стул' },
  { id: 5, label: 'Стул 1' },
  { id: 6, label: 'Стул 2' },
];

const searchCategories: Array<{id: number, label: string}> = [
  { id: 1, label: 'Shops' },
  { id: 2, label: 'Products' },
  { id: 3, label: 'All' },
];

class SearchInput extends Component<PropsType, StateType> {
  state = {
    inputValue: '',
    items: [],
    checkedDropdownItemId: null,
  };

  handleInputChange = (e: any) => {
    e.persist();
    const { value } = e.target;
    this.setState(() => ({ inputValue: value }));
    if (value === '') {
      this.setState(() => ({ items: [] }));
    } else {
      setTimeout(() => {
        const result = filter(item => startsWith(toUpper(value), toUpper(item.label)), data);
        this.setState(() => ({ items: result }));
      }, 300);
    }
  };

  handleDropdownSelect = (id: number) => {
    this.setState(() => ({ checkedDropdownItemId: id }));
  };

  renderDropdownItem = (item: {id: number, label: string}, idx: number) => {
    const { checkedDropdownItemId } = this.state;
    const checked = checkedDropdownItemId ? checkedDropdownItemId === item.id : idx === 0;
    return (
      <div
        key={item.id}
        styleName="dropdownItem"
      >
        <input
          styleName={classNames('dropdownItemInput')}
          type="radio"
          name={`input_${item.id}`}
          id={`input_${item.id}`}
          checked={checked}
          onChange={() => this.handleDropdownSelect(item.id)}
        />
        <label
          htmlFor={`input_${item.id}`}
          styleName={classNames('dropdownItemLabel', { dropdownInputChecked: checked })}
        >
          {item.label}
        </label>
      </div>
    );
  };

  render() {
    return (
      <div styleName="container">
        <span styleName="dropdown">
          {searchCategories.map(this.renderDropdownItem)}
        </span>
        <Autocomplete
          renderInput={props => (<input styleName="input" {...props} />)}
          items={this.state.items}
          getItemValue={item => item.label}
          renderItem={(item, isHighlighted) => (
            <div
              key={item.id}
              styleName={classNames('searchMenuItem', { highlighted: isHighlighted })}
            >
              {item.label}
            </div>
          )}
          value={this.state.inputValue}
          onChange={this.handleInputChange}
        />
        <button styleName="searchButton">
          <SearchIcon styleName="searchButtonIcon" />
        </button>
      </div>
    );
  }
}

export default SearchInput;
