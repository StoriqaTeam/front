// @flow

// this component in development (WIP)

import React, { Component } from 'react';
import Autocomplete from 'react-autocomplete';
import {
  filter,
  startsWith,
  toUpper,
  head,
  pathOr,
  find,
  propEq,
  assocPath,
} from 'ramda';
import classNames from 'classnames';
import { withRouter, matchShape } from 'found';
import { Environment } from 'relay-runtime';

import { Context } from 'components/App';
import { Icon } from 'components/Icon';
import { Select } from 'components/common/Select';
import { urlToInput, inputToUrl } from 'utils';

import fetchAutoCompleteProductName from './fetchAutoCompleteProductName';

import './SearchInput.scss';

import t from './i18n';

type PropsType = {
  items: ?Array<any>,
  searchCategories: ?Array<{ id: string, label: string }>,
  router: Object,
  searchValue: string,
  match: matchShape,
  onDropDown: () => void,
  isMobile: boolean,
  selectedCategory: ?{ id: string, label: string },
  relay: {
    environment: Environment,
  },
};

type StateType = {
  inputValue: string,
  items: Array<any>,
  searchCategoryId: ?number,
  isFocus: boolean,
  activeItem: ?{ id: string, label: string },
};

class SearchInput extends Component<PropsType, StateType> {
  static defaultProps = {
    onDropDown: () => {},
  };
  constructor(props: PropsType) {
    super(props);
    const { searchValue, searchCategories } = this.props;
    this.state = {
      inputValue: searchValue,
      items: [],
      // eslint-disable-next-line
      searchCategoryId: null, // it will be used when we add callback `onSearchCategoryChanged`,
      isFocus: false,
      activeItem: head(searchCategories || []),
    };
  }

  // TODO: Life cycle-hook will DEPRECATE
  componentWillMount() {
    if (process.env.BROWSER) {
      document.addEventListener('keydown', this.handleKeydown);
    }

    const { searchCategories } = this.props;
    const pathname = pathOr('', ['location', 'pathname'], this.props.match);
    const value = pathname.replace('/', '');
    if (value === 'stores') {
      this.setState({
        activeItem: find(propEq('id', 'stores'), searchCategories || []),
      });
    } else {
      this.setState({ activeItem: head(searchCategories || []) });
    }
  }

  componentWillUnmount() {
    if (process.env.BROWSER) {
      document.removeEventListener('keydown', this.handleKeydown);
    }
  }

  onFocus = (): void => {
    this.setState({ isFocus: true });
  };

  onBlur = (): void => {
    this.setState({ isFocus: false });
  };

  handleInputChange = (e: any): void => {
    e.persist();
    const { value } = e.target;
    this.setState(() => ({ inputValue: value }));
    if (value === '') {
      this.setState(() => ({ items: [] }));
    } else {
      setTimeout(() => {
        const result = filter(
          item => startsWith(toUpper(value), toUpper(item.label)),
          this.props.items || [],
        );
        this.setState({ items: result || [] });
      }, 300);
    }
  };

  handleInputChange2 = (e: any) => {
    e.persist();
    const { value } = e.target;
    this.setState(() => ({ inputValue: value }));

    fetchAutoCompleteProductName(this.props.relay.environment, { name: '' })
      .then(data => {
        console.log('---data', data);
        return true;
      })
      .catch(() => {
        //
      });
  };

  handleSearchDropDownSelect = (activeItem: {
    id: string,
    label: string,
  }): void => {
    this.setState(() => ({ activeItem }));
  };

  handleSearch = (): void => {
    const { selectedCategory } = this.props;
    const { inputValue, activeItem } = this.state;
    // $FlowIgnoreMe
    const pathname = pathOr(
      '',
      ['match', 'location', 'pathname'],
      this.props,
    ).replace('/', '');
    // $FlowIgnoreMe
    const queryObj = pathOr('', ['match', 'location', 'query'], this.props);
    const oldPreparedObj = urlToInput(queryObj);

    const newPreparedObj = assocPath(['name'], inputValue, oldPreparedObj);
    const newUrl = inputToUrl(newPreparedObj);
    switch (
      (selectedCategory && selectedCategory.id) || (activeItem && activeItem.id)
    ) {
      case 'stores':
        if (pathname === 'stores') {
          this.props.router.push(`/stores${newUrl}`);
        } else {
          this.props.router.push(
            inputValue ? `/stores?search=${inputValue}` : '/stores?search=',
          );
        }
        break;
      case 'products':
        if (pathname === 'categories') {
          this.props.router.push(`/categories${newUrl}`);
        } else {
          this.props.router.push(
            inputValue
              ? `/categories?search=${inputValue}`
              : '/categories?search=',
          );
        }
        break;
      default:
        break;
    }
  };

  handleKeydown = (e: any): void => {
    if (e.keyCode === 13 && this.state.isFocus) {
      this.handleSearch();
    }
  };

  render() {
    console.log('---this.state', this.state);
    console.log('---this.props', this.props);
    const { onDropDown, isMobile, selectedCategory } = this.props;
    console.log('---this.state.items', this.state.items);
    return (
      <div styleName="container">
        <div styleName="searchCategorySelect">
          <Select
            isMobile={isMobile}
            onClick={onDropDown}
            forAutocomlete
            activeItem={selectedCategory || this.state.activeItem}
            items={this.props.searchCategories || []}
            onSelect={this.handleSearchDropDownSelect}
            dataTest="searchInputSelect"
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
                  placeholder={t.iFind}
                  data-test="searchInput"
                />
              </div>
            )}
            items={this.state.items}
            getItemValue={item => item.label}
            renderItem={(item, isHighlighted) => (
              <div
                key={item.id}
                styleName={classNames('searchMenuItem', {
                  highlighted: isHighlighted,
                })}
              >
                {item.label}
              </div>
            )}
            value={this.state.inputValue}
            onChange={this.handleInputChange2}
            open={false}
          />
        </div>
        <button
          styleName="searchButton"
          onClick={this.handleSearch}
          data-test="searchButton"
        >
          <Icon inline type="magnifier" size={16} />
        </button>
      </div>
    );
  }
}

export default withRouter(SearchInput);
