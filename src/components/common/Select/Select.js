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
  startsWith,
} from 'ramda';
import debounce from 'lodash.debounce';

import { Icon } from 'components/Icon';
import { Input } from 'components/common/Input';

import type { Node } from 'react';

import type { SelectItemType } from 'types';

import './Select.scss';

type StateType = {
  isExpanded: boolean,
  items: Array<SelectItemType>,
  searchValue: string,
  inputValue: ?string,
  isFocusInput: boolean,
  hoverItem: ?SelectItemType,
  isOpenItems: boolean,
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
  renderSelectItem?: (item: SelectItemType) => Node,
  withInput?: boolean,
  maxItemsHeight?: number,
};

const maxItemsCount = 5;
const itemHeight = 24;

class Select extends Component<PropsType, StateType> {
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
    const { withEmpty, activeItem, withInput, items } = props;
    const newItems = !isNil(withEmpty)
      ? prepend({ id: '', label: '-' }, items)
      : items;

    this.state = {
      isExpanded: false,
      items:
        withInput === true
          ? this.updateItems(activeItem ? activeItem.label : '')
          : newItems,
      searchValue: '',
      inputValue: withInput === true && activeItem ? activeItem.label : null,
      isFocusInput: false,
      hoverItem: null,
      isOpenItems: false,
    };

    if (process.env.BROWSER) {
      window.addEventListener('click', this.handleToggleExpand);
      window.addEventListener('keydown', this.handleKeydown);
    }
    this.resetSearchValue = debounce(this.resetSearchValue, 1000);
  }

  componentDidUpdate(prevProps: PropsType, prevState: StateType) {
    const { isExpanded, items: stateItems, inputValue } = this.state;
    if (
      prevState.isExpanded !== isExpanded &&
      isExpanded &&
      prevProps.activeItem
    ) {
      this.handleAutoScroll(
        this.getIndexFromItems(prevProps.activeItem, stateItems),
      );
    }

    const { withInput, activeItem, items } = this.props;
    if (withInput === true && activeItem && !prevProps.activeItem) {
      this.updateInputValue(activeItem.label);
    }

    if (
      withInput !== true &&
      JSON.stringify(items) !== JSON.stringify(prevProps.items)
    ) {
      if (prevProps.withEmpty === true) {
        this.updateStateItems(prepend({ id: '', label: '-' }, items));
      } else {
        this.updateStateItems(items);
      }
    }
    if (
      withInput === true &&
      JSON.stringify(items) !== JSON.stringify(prevProps.items)
    ) {
      this.updateInputValue(inputValue || '');
    }
  }

  componentWillUnmount() {
    if (process.env.BROWSER) {
      window.removeEventListener('click', this.handleToggleExpand);
      window.removeEventListener('keydown', this.handleKeydown);
    }
  }

  getIndexFromItems = (item: ?SelectItemType, items: Array<SelectItemType>) =>
    item ? findIndex(propEq('id', item.id))(items) : -1;

  updateStateItems = (items: Array<SelectItemType>) => {
    this.setState({
      items,
    });
  };

  updateInputValue = (value: string) => {
    this.setState({
      inputValue: value,
      items: this.updateItems(value),
    });
  };

  button: ?HTMLDivElement;
  itemsWrap: ?HTMLElement;
  items: ?HTMLDivElement;
  clickPlane: ?HTMLDivElement;

  handleKeydown = (e: SyntheticKeyboardEvent<>): void => {
    const { withInput } = this.props;
    if (this.state.isExpanded && withInput !== true) {
      e.preventDefault();
      const { activeItem, onSelect } = this.props;
      const { items } = this.state;
      if (e.keyCode === 8) {
        onSelect({ id: '', label: '' });
        return;
      }
      if (e.keyCode === 40 || e.keyCode === 38) {
        const activeItemIdx = this.getIndexFromItems(activeItem, items);

        if (e.keyCode === 40) {
          // click down
          const newActiveItemIdx =
            activeItemIdx === length(items) - 1 ? 0 : activeItemIdx + 1;
          this.handleAutoScroll(newActiveItemIdx);
          onSelect(items[newActiveItemIdx]);
        }

        if (e.keyCode === 38) {
          // click up
          const newActiveItemIdx =
            activeItemIdx === 0 ? length(items) - 1 : activeItemIdx - 1;
          this.handleAutoScroll(newActiveItemIdx);
          onSelect(items[newActiveItemIdx]);
        }
      }

      this.setState(
        (prevState: StateType) => ({
          searchValue: `${prevState.searchValue}${e.key}`,
        }),
        this.handleKeyActiveItem,
      );
      this.resetSearchValue();

      if (e.keyCode === 27 || e.keyCode === 13) {
        this.setState({ isExpanded: false });
      }
    }

    if (withInput === true) {
      const { activeItem, onSelect } = this.props;
      const { items, hoverItem, isOpenItems } = this.state;
      if (isOpenItems && (e.keyCode === 40 || e.keyCode === 38)) {
        const activeItemIdx = this.getIndexFromItems(
          hoverItem || activeItem,
          items,
        );

        if (e.keyCode === 40) {
          // click down
          const newActiveItemIdx =
            activeItemIdx === length(items) - 1 ? 0 : activeItemIdx + 1;
          this.handleAutoScroll(newActiveItemIdx);
          const newItem = items[newActiveItemIdx];
          this.setState({ hoverItem: newItem });
        }

        if (e.keyCode === 38) {
          // click up
          const newActiveItemIdx =
            activeItemIdx === 0 ? length(items) - 1 : activeItemIdx - 1;
          this.handleAutoScroll(newActiveItemIdx);
          const newItem = items[newActiveItemIdx];
          this.setState({ hoverItem: newItem });
        }
      }

      if (e.keyCode === 13 && hoverItem) {
        this.setState(
          {
            inputValue: hoverItem.label,
            hoverItem: null,
            isOpenItems: false,
            items: this.updateItems(hoverItem.label),
          },
          () => {
            onSelect(hoverItem);
          },
        );
      }
    }
  };

  handleKeyActiveItem = (): void => {
    const { onSelect } = this.props;
    const { searchValue, items } = this.state;
    const filteredItems = filter(
      item => new RegExp(`^${searchValue}`).test(toLower(item.label)),
      items,
    );
    if (!isEmpty(filteredItems)) {
      const idx = this.getIndexFromItems(head(filteredItems), items);
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
    const { onClick, withInput, activeItem } = this.props;
    const isButtonClick = this.button && this.button.contains(e.target);
    const isItemsWrap = this.itemsWrap && this.itemsWrap.contains(e.target);
    const isItems = this.items && this.items.contains(e.target);
    const isСlickPlane = this.clickPlane && this.clickPlane.contains(e.target);

    if (withInput === true && !isButtonClick && !isItems && !isСlickPlane) {
      this.setState({
        isOpenItems: false,
        inputValue: activeItem ? activeItem.label : '',
        hoverItem: null,
        items: this.updateItems(activeItem ? activeItem.label : ''),
      });
      return;
    }

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
    const { onSelect, withInput, activeItem } = this.props;
    const { items } = this.state;
    const result = find(propEq('id', e.target.id), items);
    if (onSelect && !isNil(result)) {
      if (withInput === true) {
        this.setState({
          inputValue: result.label,
          isOpenItems: false,
          items: this.updateItems(result.label),
        });
      }
      if (activeItem && activeItem.id === result.id) {
        return;
      }
      onSelect(result);
    }
  };

  handleChangeInput = (e: SyntheticInputEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const { activeItem } = this.props;
    const items = this.updateItems(value);
    this.setState(
      {
        inputValue: value,
        items,
        isOpenItems: true,
        hoverItem: length(items) === 1 ? head(items) : null,
      },
      () => {
        const activeItemIdx = this.getIndexFromItems(
          activeItem,
          this.updateItems(value),
        );
        this.handleAutoScroll(activeItemIdx);
      },
    );
  };

  handleFocusInput = () => {
    this.setState({ isFocusInput: true, isOpenItems: true });
  };

  handleBlurInput = () => {
    this.setState({ isFocusInput: false, isExpanded: false });
  };

  updateItems = (value: string): Array<SelectItemType> => {
    const { items } = this.props;
    if (value === '') {
      return items;
    }
    const newItems = filter(
      item => startsWith(toLower(value), toLower(item.label)),
      items,
    );
    return newItems;
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
      renderSelectItem,
      withInput,
      maxItemsHeight,
    } = this.props;
    const {
      isExpanded,
      items,
      inputValue,
      isFocusInput,
      hoverItem,
      isOpenItems,
    } = this.state;
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
              labelFloat:
                withInput === true
                  ? (inputValue !== null && inputValue !== '') ||
                    isFocusInput ||
                    isOpenItems
                  : activeItem || isExpanded,
            })}
          >
            {label}
          </div>
        )}
        <div styleName={classNames('wrap', { transparent })}>
          {activeItem &&
            activeItem.label &&
            withInput !== true && (
              <div styleName="selected">{activeItem.label}</div>
            )}
          {withInput === true && (
            <div styleName="inputWrap">
              <Input
                fullWidth
                value={inputValue || ''}
                onChange={this.handleChangeInput}
                onFocus={this.handleFocusInput}
                onBlur={this.handleBlurInput}
                dataTest={`${dataTest}Input`}
              />
            </div>
          )}
          <div
            styleName={classNames('icon', {
              rotateIcon: withInput === true ? isFocusInput : isExpanded,
            })}
          >
            <Icon type="arrowExpand" />
          </div>
          <div
            ref={node => {
              this.items = node;
            }}
            styleName={classNames('items', {
              hidden:
                withInput === true
                  ? !isOpenItems || isEmpty(items)
                  : !isExpanded,
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
              style={{
                maxHeight:
                  maxItemsHeight != null
                    ? `${maxItemsHeight}rem`
                    : `${maxItemsCount * itemHeight / 8}rem`,
              }}
            >
              {items.map(item => {
                const { id } = item;
                return renderSelectItem ? (
                  renderSelectItem(item)
                ) : (
                  <div
                    key={`${id}-${item.label}`}
                    id={id}
                    styleName={classNames('item', {
                      active:
                        withInput === true && hoverItem
                          ? hoverItem.id === id
                          : activeItem && activeItem.id === id,
                    })}
                    data-test={`${dataTest}_item${
                      label != null ? `_${label}` : ''
                    }_${item.label}`}
                  >
                    {item.label}
                  </div>
                );
              })}
            </div>
          </div>
          <div
            ref={node => {
              this.clickPlane = node;
            }}
            styleName="clickPlane"
          />
        </div>
        {(!isNil(forForm) || !isNil(forSearch) || isBirthdate) &&
          withInput !== true && <div styleName="hr" />}
      </div>
    );
  }
}

export default Select;
