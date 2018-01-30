// @flow

import React, { Component } from 'react';
import Autocomplete from 'react-autocomplete';
import { filter, startsWith, toUpper } from 'ramda';
import classNames from 'classnames';

import SearchIcon from './svg/search.svg';
import './SearchInput.scss';

type PropsType = {};

type StateType = {
  inputValue: string,
  items: Array<any>,
};

const data: Array<{id: number, label: string}> = [
  { id: 1, label: 'Стол' },
  { id: 2, label: 'Стол письменный' },
  { id: 3, label: 'Стол журнальный' },
  { id: 4, label: 'Стул' },
  { id: 5, label: 'Стул 1' },
  { id: 6, label: 'Стул 2' },
];

class SearchInput extends Component<PropsType, StateType> {
  state = {
    inputValue: '',
    items: [],
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

  render() {
    return (
      <div styleName="container">
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
