// @flow

// this component in development (WIP)

import React, { Component } from 'react';
import Autocomplete from 'react-autocomplete';
import { filter, startsWith, toUpper } from 'ramda';
import classNames from 'classnames';

import { Icon } from 'components/Icon';
import { MiniSelect } from 'components/MiniSelect';

import './SearchInput.scss';

type PropsType = {
  items: ?Array<any>,
  searchCategories: ?Array<{ id: number, label: string }>
};

type StateType = {
  inputValue: string,
  items: Array<any>,
  activeItem: { id: string, label: string },
};

class SearchInput extends Component<PropsType, StateType> {
  state = {
    inputValue: '',
    items: [],
    // eslint-disable-next-line
    activeItem: { id: 'stores', label: 'Shops' },
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

  handleSearchDropdownSelect = (activeItem: { id: string, label: string }) => {
    this.setState(() => ({ activeItem }));
  };

  render() {
    return (
      <div styleName="container">
        <div styleName="searchCategorySelect">
          <MiniSelect
            forAutocomlete
            activeItem={this.state.activeItem}
            items={this.props.searchCategories || []}
            onSelect={this.handleSearchDropdownSelect}
          />
        </div>
        <div styleName="searchInput">
          <Autocomplete
            wrapperStyle={{ display: 'flex', width: '100%' }}
            renderInput={props => (<div styleName="inputWrapper"><input styleName="input" {...props} /></div>)}
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
            open={false}
          />
        </div>
        <button styleName="searchButton">
          <Icon
            inline
            type="magnifier"
            size="16"
          />
        </button>
      </div>
    );
  }
}

export default SearchInput;
