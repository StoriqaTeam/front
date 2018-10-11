// @flow strict

import React, { Component } from 'react';
import classNames from 'classnames';
import {
  find,
  propEq,
  prepend,
  findIndex,
  length,
  filter,
  toLower,
  head,
  isEmpty,
  isNil,
} from 'ramda';
import debounce from 'lodash.debounce';

import { Icon } from 'components/Icon';

import type { SelectItemType } from 'types';

import './Select.scss';

type StateType = {
  isExpanded: boolean,
  items: Array<SelectItemType>,
  searchValue: string,
};

type PropsType = {
  transparent: boolean,
  items: Array<SelectItemType>,
  onSelect: (item: SelectItemType) => void,
  label?: ?string,
  activeItem: ?SelectItemType,
  forForm: boolean,
  forSearch: boolean,
  forAutocomlete: boolean,
  fullWidth: boolean,
  containerStyle?: ?{
    [name: string]: string,
  },
  dataTest: string,
  // eslint-disable-next-line
  withEmpty?: boolean,
  isBirthdate?: boolean,
  onClick: () => void,
  isMobile: boolean,
};

const maxItemsCount = 5;
const itemHeight = 24;

class Select extends Component<PropsType, StateType> {
  static getDerivedStateFromProps(nextProps: PropsType, prevState: StateType) {
    const { items, withEmpty } = nextProps;
    return {
      ...prevState,
      items: !isNil(withEmpty) ? prepend({ id: '', label: '' }, items) : items,
    };
  }

  static defaultProps = {
    onClick: () => {},
    isMobile: false,
    forForm: false,
    forSearch: false,
    forAutocomlete: false,
    fullWidth: false,
    transparent: false,
  };

  constructor(props: PropsType) {
    super(props);
    this.state = {
      isExpanded: false,
      items: props.items,
      searchValue: '',
    };
    if (process.env.BROWSER) {
      window.addEventListener('click', this.handleToggleExpand);
      window.addEventListener('keydown', this.handleKeydown);
    }
    this.resetSearchValue = debounce(this.resetSearchValue, 1000);
  }

  componentDidUpdate(prevProps: PropsType, prevState: StateType) {
    const { isExpanded } = this.state;
    if (
      prevState.isExpanded !== isExpanded &&
      isExpanded &&
      prevProps.activeItem
    ) {
      this.handleAutoScroll(this.getIndexFromItems(prevProps.activeItem));
    }
  }

  componentWillUnmount() {
    if (process.env.BROWSER) {
      window.removeEventListener('click', this.handleToggleExpand);
      window.removeEventListener('keydown', this.handleKeydown);
    }
  }

  getIndexFromItems = (item: ?SelectItemType) =>
    item ? findIndex(propEq('id', item.id))(this.props.items) : -1;

  button: ?HTMLDivElement;
  itemsWrap: ?HTMLElement;
  items: ?HTMLDivElement;

  handleKeydown = (e: SyntheticKeyboardEvent<>): void => {
    if (this.state.isExpanded) {
      e.preventDefault();
      const { items, activeItem } = this.props;
      if (e.keyCode === 40 || e.keyCode === 38) {
        const { onSelect } = this.props;
        const activeItemIdx = this.getIndexFromItems(activeItem);

        if (e.keyCode === 40) {
          // click down
          const newActiveItemIdx =
            activeItemIdx === length(items) - 1 ? 0 : activeItemIdx + 1;
          this.handleAutoScroll(newActiveItemIdx, 'smooth');
          onSelect(items[newActiveItemIdx]);
        }

        if (e.keyCode === 38) {
          // click up
          const newActiveItemIdx =
            activeItemIdx === 0 ? length(items) - 1 : activeItemIdx - 1;
          this.handleAutoScroll(newActiveItemIdx, 'smooth');
          onSelect(items[newActiveItemIdx]);
        }
      }

      if (this.state.isExpanded) {
        this.setState(
          (prevState: StateType) => ({
            searchValue: `${prevState.searchValue}${e.key}`,
          }),
          this.handleKeyActiveItem,
        );
        this.resetSearchValue();
      }

      if (e.keyCode === 27 || e.keyCode === 13) {
        this.setState({ isExpanded: false });
      }
    }
  };

  handleKeyActiveItem = (): void => {
    const { items, onSelect } = this.props;
    const { searchValue } = this.state;
    const filteredItems = filter(
      item => new RegExp(`^${searchValue}`).test(toLower(item.label)),
      items,
    );
    if (!isEmpty(filteredItems)) {
      const idx = this.getIndexFromItems(head(filteredItems));
      this.handleAutoScroll(idx);
      onSelect(items[idx]);
    }
  };

  resetSearchValue = (): void => {
    this.setState({ searchValue: '' });
  };

  handleAutoScroll = (idx: number, behavior: ?string): void => {
    const visibleHeight = itemHeight * maxItemsCount;
    let itemsWrapScroll = 0;
    if (!isNil(this.itemsWrap)) {
      itemsWrapScroll = this.itemsWrap.scrollTop;
    }
    // new item is not included above
    if ((idx - 1) * itemHeight < itemsWrapScroll) {
      // $FlowIgnoreMe
      if (!isNil(this.itemsWrap) && !isNil(this.itemsWrap.scroll)) {
        this.itemsWrap.scroll({ top: idx * itemHeight, behavior });
      }
    }
    // new item is not included below
    if ((idx + 1) * itemHeight > itemsWrapScroll + visibleHeight) {
      // $FlowIgnoreMe
      if (!isNil(this.itemsWrap) && !isNil(this.itemsWrap.scroll)) {
        this.itemsWrap.scroll({
          top: (idx + 1) * itemHeight - visibleHeight,
          behavior,
        });
      }
    }
  };

  handleToggleExpand = (e: SyntheticInputEvent<>): void => {
    const { onClick } = this.props;
    const isButtonClick = this.button && this.button.contains(e.target);
    const isItemsWrap = this.itemsWrap && this.itemsWrap.contains(e.target);
    const isItems = this.items && this.items.contains(e.target);

    if (isButtonClick && !isItems && !isItemsWrap) {
      this.setState(
        (prevState: StateType) => ({
          isExpanded: !prevState.isExpanded,
        }),
        onClick,
      );
      return;
    }

    if ((!isButtonClick && !isItems) || isItemsWrap) {
      this.setState({ isExpanded: false });
    }
  };

  handleItemClick = (e: SyntheticInputEvent<HTMLDivElement>): void => {
    const { onSelect, items } = this.props;
    const result = find(propEq('id', e.target.id), items);
    if (this.props && onSelect && !isNil(result)) {
      onSelect(result);
    }
  };

  render() {
    const {
      transparent,
      label,
      activeItem,
      forForm,
      fullWidth,
      forSearch,
      forAutocomlete,
      containerStyle,
      dataTest,
      isBirthdate,
      isMobile,
    } = this.props;
    const { isExpanded, items } = this.state;
    return (
      <div
        ref={node => {
          this.button = node;
        }}
        styleName={classNames('container', {
          forForm,
          forSearch,
          forAutocomlete,
          fullWidth,
          isBirthdate,
          isExpanded,
        })}
        style={containerStyle}
        data-test={dataTest}
      >
        {((!isNil(label) && !isBirthdate) ||
          !(!isNil(isBirthdate) && activeItem)) && (
          <div
            styleName={classNames('label', {
              labelFloat: activeItem || isExpanded,
            })}
          >
            {label}
          </div>
        )}
        <div styleName={classNames('wrap', { transparent })}>
          {activeItem &&
            activeItem.label && (
              <div styleName="selected">{activeItem.label}</div>
            )}
          <div styleName={classNames('icon', { rotateIcon: isExpanded })}>
            <Icon type="arrowExpand" />
          </div>
          <div
            ref={node => {
              this.items = node;
            }}
            styleName={classNames('items', {
              hidden: !isExpanded,
              isMobile,
            })}
          >
            <div
              ref={node => {
                this.itemsWrap = node;
              }}
              styleName="itemsWrap"
              onClick={this.handleItemClick}
              onKeyDown={() => {}}
              role="button"
              tabIndex="0"
              style={{ maxHeight: `${maxItemsCount * itemHeight / 8}rem` }}
            >
              {items.map(item => {
                const { id } = item;
                return (
                  <div
                    key={`${id}-${item.label}`}
                    id={id}
                    styleName={classNames('item', {
                      active: activeItem && activeItem.id === id,
                    })}
                    data-test={`${dataTest}_item`}
                  >
                    {item.label}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {(!isNil(forForm) || !isNil(forSearch) || isBirthdate) && (
          <div styleName="hr" />
        )}
      </div>
    );
  }
}

export default Select;
