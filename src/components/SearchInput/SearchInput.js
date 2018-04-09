// @flow

// this component in development (WIP)

import React, { Component } from 'react';
import Autocomplete from 'react-autocomplete';
import { filter, startsWith, toUpper } from 'ramda';
import classNames from 'classnames';
import { withRouter } from 'found';

import { DropdownSelect } from 'components/DropdownSelect';
import { Icon } from 'components/Icon';

import './SearchInput.scss';

type PropsType = {
  items: ?Array<any>,
  searchCategories: ?Array<{ id: number, label: string }>,
  router: Object,
  searchValue: string,
};

type StateType = {
  inputValue: string,
  items: Array<any>,
  searchCategoryId: ?number,
  isFocus: boolean,
};

class SearchInput extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      inputValue: this.props.searchValue,
      items: [],
      // eslint-disable-next-line
      searchCategoryId: null, // it will be used when we add callback `onSearchCategoryChanged`,
      isFocus: false,
    };
  }

  componentWillMount() {
    if (process.env.BROWSER) {
      document.addEventListener('keydown', this.handleKeydown);
    }
  }

  componentWillUnmount() {
    if (process.env.BROWSER) {
      document.removeEventListener('keydown', this.handleKeydown);
    }
  }

  onFocus = () => {
    this.setState({ isFocus: true });
  }

  onBlur = () => {
    this.setState({ isFocus: false });
  }

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

  handleSearch = () => {
    const { inputValue } = this.state;
    this.props.router.push(inputValue ? `/stores?search=${inputValue}` : '/stores');
  }

  handleKeydown = (e: any) => {
    if (e.keyCode === 13 && this.state.isFocus) {
      this.handleSearch();
    }
  }

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
        <div styleName="searchInput">
          <Autocomplete
            wrapperStyle={{ display: 'flex', width: '100%' }}
            renderInput={props => (
              <div styleName="inputWrapper">
                <input
                  {...props}
                  styleName="input"
                  onFocus={this.onFocus}
                  onBlur={this.onBlur}
                />
              </div>
            )}
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
        <button styleName="searchButton" onClick={this.handleSearch}>
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

export default withRouter(SearchInput);
