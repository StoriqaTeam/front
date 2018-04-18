// @flow

// this component in development (WIP)

import React, { Component } from 'react';
import Autocomplete from 'react-autocomplete';
import { filter, startsWith, toUpper, head, pathOr, find, propEq } from 'ramda';
import classNames from 'classnames';
import { withRouter } from 'found';

import { Icon } from 'components/Icon';
import { Select } from 'components/common/Select';

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
  activeItem: { id: string, label: string },
};

class SearchInput extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    const { searchValue, searchCategories } = this.props;
    this.state = {
      inputValue: searchValue,
      items: [],
      // eslint-disable-next-line
      searchCategoryId: null, // it will be used when we add callback `onSearchCategoryChanged`,
      isFocus: false,
      activeItem: head(searchCategories),
    };
  }

  componentWillMount() {
    if (process.env.BROWSER) {
      document.addEventListener('keydown', this.handleKeydown);
    }

    const { searchCategories } = this.props;
    const pathname = pathOr(null, ['match', 'location', 'pathname'], this.props);
    const value = pathname.replace('/', '');
    if (value === 'stores') {
      this.setState({ activeItem: find(propEq('id', 'stores'))(searchCategories) });
    } else {
      this.setState({ activeItem: head(searchCategories) });
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

  handleSearchDropdownSelect = (activeItem: { id: string, label: string }) => {
    this.setState(() => ({ activeItem }));
  };

  handleSearch = () => {
    const { inputValue, activeItem } = this.state;
    switch (activeItem.id) {
      case 'stores':
        this.props.router.push(inputValue ? `/stores?search=${inputValue}` : '/stores');
        break;
      case 'products':
        this.props.router.push(inputValue ? `/categories?search=${inputValue}` : '/categories?search=');
        break;
      default:
        break;
    }
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
          <Select
            forAutocomlete
            activeItem={this.state.activeItem}
            items={this.props.searchCategories || []}
            onSelect={this.handleSearchDropdownSelect}
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
                  placeholder="I find..."
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
