// @flow strict

import React, { Component } from 'react';
import Autocomplete from 'react-autocomplete';
import {
  pathOr,
  propEq,
  assocPath,
  isEmpty,
  take,
  length,
  findIndex,
  map,
  omit,
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
import fetchAutoCompleteStoreName from './fetchAutoCompleteStoreName';

import './SearchInput.scss';

import t from './i18n';

type PropsType = {
  searchCategories: Array<SelectItemType>,
  router: routerShape,
  searchValue: ?string,
  match: matchShape,
  onDropDown: () => void,
  isMobile?: boolean,
  selectedCategory: ?SelectItemType,
  environment: Environment,
  getSearchItems?: (items: Array<SelectItemType>) => void,
};

type StateType = {
  inputValue: string,
  items: Array<SelectItemType>,
  isFocus: boolean,
  activeItem: SelectItemType,
  arrowItem: ?SelectItemType,
};

const maxSearchAmount = 5;

class SearchInput extends Component<PropsType, StateType> {
  static getDerivedStateFromProps(nextProps: PropsType, prevState: StateType) {
    const { selectedCategory } = nextProps;
    const { activeItem } = prevState;
    if (selectedCategory && selectedCategory.id !== activeItem.id) {
      return {
        activeItem: selectedCategory,
        items: [],
      };
    }
    return null;
  }

  constructor(props: PropsType) {
    super(props);
    if (process.env.BROWSER) {
      document.addEventListener('keydown', this.handleKeydown);
    }

    const { searchValue, searchCategories } = props;
    const pathname = pathOr('', ['location', 'pathname'], this.props.match);
    const value = pathname.replace('/', '');

    this.state = {
      inputValue: searchValue || '',
      items: [],
      isFocus: false,
      activeItem:
        value === 'stores' ? searchCategories[1] : searchCategories[0],
      arrowItem: null,
    };
    this.handleFetchAutoCompleteProductName = debounce(
      this.handleFetchAutoCompleteProductName,
      1000,
    );
  }

  componentDidUpdate(prevProps: PropsType) {
    const { searchValue } = this.props;
    if (searchValue !== null && searchValue !== prevProps.searchValue) {
      this.updateSearchValue(searchValue || '');
    }
  }

  componentWillUnmount() {
    if (process.env.BROWSER) {
      document.removeEventListener('keydown', this.handleKeydown);
    }
  }

  getSearchItems = (items: Array<SelectItemType>) => {
    const { getSearchItems } = this.props;
    if (getSearchItems) {
      getSearchItems(items);
    }
  };

  updateSearchValue = (searchValue: string) => {
    this.setState({ inputValue: searchValue });
  };

  handleFocus = (): void => {
    this.setState({ isFocus: true });
  };

  handleBlur = (): void => {
    this.setState({ isFocus: false });
  };

  handleFetchAutoCompleteProductName = (value: string) => {
    fetchAutoCompleteProductName(this.props.environment, { name: value })
      .then(data => {
        const items = pathOr(
          [],
          ['search', 'autoCompleteProductName', 'edges'],
          data,
        );
        this.setState(
          prevState => {
            if (!prevState.inputValue) {
              return { items: [] };
            }
            return {
              items: take(
                maxSearchAmount,
                map(item => ({ id: item.node, label: item.node }), items),
              ),
            };
          },
          () => {
            this.getSearchItems(this.state.items);
          },
        );
        return true;
      })
      .catch(() => {
        this.setState({ items: [] });
      });
  };

  handleFetchAutoCompleteStoreName = (value: string) => {
    fetchAutoCompleteStoreName(this.props.environment, { name: value })
      .then(data => {
        const items = pathOr(
          [],
          ['search', 'autoCompleteStoreName', 'edges'],
          data,
        );
        this.setState(
          prevState => {
            if (!prevState.inputValue) {
              return { items: [] };
            }
            return {
              items: take(
                maxSearchAmount,
                map(item => ({ id: item.node, label: item.node }), items),
              ),
            };
          },
          () => {
            this.getSearchItems(this.state.items);
          },
        );
        return true;
      })
      .catch(() => {
        this.setState({ items: [] });
      });
  };

  handlefetchAutocomplete = (value: string) => {
    if (!value) {
      this.setState({ items: [] }, () => {
        this.getSearchItems([]);
      });
      return;
    }
    const { activeItem } = this.state;
    switch (activeItem.id) {
      case 'stores':
        this.handleFetchAutoCompleteStoreName(value);
        break;
      case 'products':
        this.handleFetchAutoCompleteProductName(value);
        break;
      default:
        break;
    }
  };

  handleInputChange = (e: SyntheticInputEvent<HTMLInputElement>) => {
    const { value } = e.target;
    this.setState(
      {
        inputValue: value,
        arrowItem: null,
        isFocus: true,
      },
      () => {
        this.handlefetchAutocomplete(value);
      },
    );
  };

  handleSearchDropDownSelect = (activeItem: {
    id: string,
    label: string,
  }): void => {
    this.setState(() => ({ activeItem, items: [] }));
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
    const oldPreparedObj = urlToInput(omit(['maxValue', 'minValue'], queryObj));
    const newPreparedObj = assocPath(['name'], inputValue, oldPreparedObj);
    const newUrl = inputToUrl(
      newPreparedObj.options ? newPreparedObj : newPreparedObj,
    );
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
    if (e.keyCode === 13 && isFocus) {
      if (arrowItem) {
        this.handleOnSetValue(arrowItem.label);
        return;
      }
      this.handleSearch();
      return;
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
        return;
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
        arrowItem: null,
      },
      this.handleSearch,
    );
  };

  render() {
    const { onDropDown, isMobile, selectedCategory } = this.props;
    const { items: searchItems, inputValue, arrowItem } = this.state;
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
                  onFocus={() => {
                    props.onFocus();
                    this.handleFocus();
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
                  <div styleName={classNames('items', { isMobile })}>
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
                <div
                  styleName="itemText"
                  onClick={() => {
                    this.handleOnSetValue(item.label);
                  }}
                  onKeyDown={() => {}}
                  role="button"
                  tabIndex="0"
                >
                  {item.label}
                </div>
              </div>
            )}
            value={inputValue}
            onChange={this.handleInputChange}
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
