// @flow

// this component in development (WIP)

import React, { Component } from 'react';
import Autocomplete from 'react-autocomplete';
import { filter, startsWith, toUpper } from 'ramda';
import classNames from 'classnames';

import { DropdownSelect } from 'components/DropdownSelect';

import SearchIcon from './svg/search.svg';
import './SearchInput.scss';

type PropsType = {
  items: ?Array<any>,
  searchCategories: ?Array<any>
};

type StateType = {
  inputValue: string,
  items: Array<any>,
  searchCategoryId: ?number,
};

class SearchInput extends Component<PropsType, StateType> {
  state = {
    inputValue: '',
    items: [],
    // eslint-disable-next-line
    searchCategoryId: null, // it will be used when we add callback `onSearchCategoryChanged`
  };

  handleInputChange = (e: any) => {
    e.persist();
    const { value } = e.target;
    this.setState(() => ({ inputValue: value }));
    if (value === '') {
      this.setState(() => ({ items: [] }));
    } else {
      setTimeout(() => {
        const result = filter(
          item => startsWith(toUpper(value), toUpper(item.label)),
          this.props.items,
        );
        this.setState({ items: result });
      }, 300);
    }
  };

  handleSearchDropdownSelect = (id: number) => {
    this.setState(() => ({ searchCategoryId: id }));
  };

  render() {
    return (
      <div styleName="container">
        <div styleName="searchCategorySelect">
          <DropdownSelect
            namePrefix="search"
            items={this.props.searchCategories || []}
            onDropdownSelect={this.handleSearchDropdownSelect}
          />
        </div>
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
