// @flow strict

import React, { Component } from 'react';
import Autocomplete from 'react-autocomplete';
import {
  head,
  pathOr,
  find,
  propEq,
  assocPath,
  isEmpty,
  // take,
  length,
  findIndex,
} from 'ramda';
import classNames from 'classnames';
import { withRouter, matchShape, routerShape } from 'found';
import { Environment } from 'relay-runtime';

import debounce from 'lodash.debounce';
import { ContextDecorator } from 'components/App';
import { Icon } from 'components/Icon';
import { Select } from 'components/common/Select';
import { urlToInput, inputToUrl } from 'utils';

import type { SelectItemType } from 'types';

import fetchAutoCompleteProductName from './fetchAutoCompleteProductName';

import './SearchInput.scss';

import t from './i18n';

type PropsType = {
  searchCategories: ?Array<SelectItemType>,
  router: routerShape,
  searchValue: string,
  match: matchShape,
  onDropDown: () => void,
  isMobile: boolean,
  selectedCategory: ?SelectItemType,
  environment: Environment,
};

type StateType = {
  inputValue: string,
  items: ?Array<SelectItemType>,
  isFocus: boolean,
  activeItem: ?SelectItemType,
  arrowItem: ?SelectItemType,
};

const maxSearchAmount = 5;

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
      isFocus: false,
      activeItem: head(searchCategories || []),
      arrowItem: null,
    };
    this.handleFetchAutoCompleteProductName = debounce(
      this.handleFetchAutoCompleteProductName,
      1000,
    );
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

  handleFocus = (e: SyntheticInputEvent<HTMLInputElement>): void => {
    const { value } = e.target;
    this.setState({ isFocus: true }, () => {
      if (value && isEmpty(this.state.items)) {
        this.handleFetchAutoCompleteProductName(value);
      }
    });
  };

  handleBlur = (): void => {
    this.setState({ isFocus: false });
  };

  handleFetchAutoCompleteProductName = (value: string) => {
    if (!value) {
      this.setState({ items: [] });
      return;
    }
    fetchAutoCompleteProductName(this.props.environment, { name: value })
      .then(() => {
        // console.log('---search', search);
        // const items = [
        //   { id: '1', label: 'Cute' },
        //   { id: '2', label: 'Cute bag' },
        //   { id: '3', label: 'Cute shirt' },
        //   { id: '4', label: 'Cute shirt 4' },
        //   { id: '5', label: 'Cute shirt 5' },
        //   { id: '6', label: 'Cute shirt 6' },
        //   { id: '7', label: 'Cute shirt 7' },
        //   { id: '8', label: 'Cute shirt 8' },
        //   { id: '9', label: 'Cute shirt 9' },
        //   { id: '10', label: 'Cute shirt 10' },
        //   { id: '11', label: 'Cute shirt 11' },
        // ];
        // this.setState({ items: take(maxSearchAmount, items) });
        this.setState({ items: [] });
        return true;
      })
      .catch(() => {
        //
      });
  };

  handleInputChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
    const { value } = e.target;
    this.setState(
      () => ({ inputValue: value }),
      () => {
        this.handleFetchAutoCompleteProductName(value);
      },
    );
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

  handleKeydown = (e: KeyboardEvent): void => {
    const { isFocus, items, arrowItem } = this.state;
    if (e.keyCode === 13 && isFocus && isEmpty(items)) {
      if (arrowItem) {
        this.handleOnSetValue(arrowItem.label);
        return;
      }
      this.handleSearch();
    }
    if (isFocus && items && !isEmpty(items)) {
      if (e.keyCode === 38) {
        this.setState((prevState: StateType) => {
          const arrowIdx = prevState.arrowItem
            ? findIndex(propEq('id', prevState.arrowItem.id))(items) - 1
            : length(items) - 1;
          return {
            arrowItem: items[arrowIdx === -1 ? length(items) - 1 : arrowIdx],
          };
        });
      }
      if (e.keyCode === 40) {
        this.setState((prevState: StateType) => {
          const arrowIdx = prevState.arrowItem
            ? findIndex(propEq('id', prevState.arrowItem.id))(items) + 1
            : 0;
          return {
            arrowItem: items[arrowIdx === maxSearchAmount ? 0 : arrowIdx],
          };
        });
      }
    }
  };

  handleOnSetValue = (value: string) => {
    this.setState(
      {
        inputValue: value,
        items: [],
        isFocus: false,
        arrowItem: null,
      },
      this.handleSearch,
    );
  };

  render() {
    const { onDropDown, isMobile, selectedCategory } = this.props;
    const { isFocus, items: searchItems, inputValue, arrowItem } = this.state;
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
            wrapperStyle={{ position: 'relative' }}
            renderInput={props => (
              <div styleName="inputWrapper">
                <input
                  {...props}
                  styleName="input"
                  onFocus={e => {
                    props.onFocus();
                    this.handleFocus(e);
                  }}
                  onBlur={() => {
                    props.onBlur();
                    this.handleBlur();
                  }}
                  placeholder={t.iFind}
                  data-test="searchInput"
                />
              </div>
            )}
            items={searchItems}
            getItemValue={item => item.label}
            renderMenu={items => (
              <div>
                {!isEmpty(items) && (
                  <div styleName={classNames('items', { hidden: !isFocus })}>
                    {items}
                  </div>
                )}
              </div>
            )}
            renderItem={item => (
              <div
                key={item.id}
                styleName={classNames('searchMenuItem', {
                  highlighted: arrowItem && arrowItem.id === item.id,
                })}
              >
                {item.label}
              </div>
            )}
            value={inputValue}
            onChange={this.handleInputChange}
            onSelect={selectedValue => {
              this.handleOnSetValue(selectedValue);
            }}
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

export default withRouter(ContextDecorator(SearchInput));
