// @flow

import React, { Component } from 'react';
import type { Node } from 'react';
import classNames from 'classnames';
import { find, propEq, prepend, findIndex, length } from 'ramda';

import { Icon } from 'components/Icon';

import './Select.scss';

type SelectType = {
  id: string,
  label: string,
};

type StateType = {
  isExpanded: boolean,
  items: Array<{ id: string, label: string }>,
  isSelectUse: ?Node,
};

type PropsType = {
  transparent: ?boolean,
  items: Array<{ id: string, label: string }>,
  onSelect: (item: ?SelectType) => void,
  label: ?string,
  activeItem: ?{ id: string, label: string },
  forForm: ?boolean,
  forSearch: ?boolean,
  forAutocomlete: ?boolean,
  fullWidth: ?boolean,
  containerStyle: ?{
    [name: string]: any,
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
      items: withEmpty ? prepend({ id: '', label: '' }, items) : items,
    };
  }

  static defaultProps = {
    onClick: () => {},
    isMobile: false,
  };

  constructor(props: PropsType) {
    super(props);
    this.state = {
      isExpanded: false,
      items: props.items,
      isSelectUse: null,
    };
    if (process.env.BROWSER) {
      window.addEventListener('click', this.handleToggleExpand);
      window.addEventListener('keydown', this.handleToggleExpand);
    }
  }

  componentDidMount() {
    if (process.env.BROWSER) {
      document.addEventListener('keydown', this.handleKeydown);
    }
  }

  componentDidUpdate(prevProps: PropsType, prevState: StateType) {
    const { isExpanded } = this.state;
    if (prevState.isExpanded !== isExpanded && isExpanded) {
      this.handleAutoScroll();
    }
  }

  componentWillUnmount() {
    if (process.env.BROWSER) {
      window.removeEventListener('click', this.handleToggleExpand);
      window.removeEventListener('keydown', this.handleToggleExpand);
    }
  }

  button: any;
  itemsWrap: any;
  items: any;

  handleKeydown = (e: any): void => {
    if (this.state.isSelectUse && (e.keyCode === 40 || e.keyCode === 38)) {
      e.preventDefault();
      this.setState({ isExpanded: true });

      if (e.keyCode === 40) {
        this.handleAutoScroll('down');
      }

      if (e.keyCode === 38) {
        this.handleAutoScroll('up');
      }
    }
  };

  handleAutoScroll = (duration?: string) => {
    const { items, activeItem, onSelect } = this.props;
    const itemsHeight = itemHeight * length(items);
    const visibleHeight = itemHeight * maxItemsCount;
    const itemsWrapScroll = this.itemsWrap.scrollTop;
    const activeItemIdx = activeItem
      ? findIndex(propEq('id', activeItem.id))(items)
      : -1;

    if (duration === 'down') {
      // new item is not included below
      if (
        activeItemIdx !== length(items) - 1 &&
        (activeItemIdx + 2) * itemHeight > itemsWrapScroll + visibleHeight
      ) {
        this.itemsWrap.scroll({
          top: (activeItemIdx + 2 - maxItemsCount) * itemHeight,
          behavior: 'smooth',
        });
      }
      // new item is not included above
      if ((activeItemIdx + 1) * itemHeight <= itemsWrapScroll) {
        this.itemsWrap.scroll({
          top: (activeItemIdx + 1) * itemHeight,
          behavior: 'smooth',
        });
      }
      // new item is first
      if (activeItemIdx === length(items) - 1 && itemsWrapScroll > 0) {
        this.itemsWrap.scroll({ top: 0, behavior: 'smooth' });
      }
      onSelect(
        activeItemIdx === length(items) - 1
          ? items[0]
          : items[activeItemIdx + 1],
      );
    }

    if (duration === 'up') {
      // new item is not included above
      if (
        activeItemIdx !== 0 &&
        (activeItemIdx - 1) * itemHeight < itemsWrapScroll
      ) {
        this.itemsWrap.scroll({
          top: (activeItemIdx - 1) * itemHeight,
          behavior: 'smooth',
        });
      }
      // new item is not included below
      if (activeItemIdx * itemHeight > itemsWrapScroll + visibleHeight) {
        this.itemsWrap.scroll({
          top: activeItemIdx * itemHeight - visibleHeight,
          behavior: 'smooth',
        });
      }
      // new item is last
      if (
        activeItemIdx === 0 &&
        visibleHeight + itemsWrapScroll < itemsHeight
      ) {
        this.itemsWrap.scroll({
          top: itemsHeight - visibleHeight,
          behavior: 'smooth',
        });
      }
      onSelect(
        activeItemIdx === 0
          ? items[length(items) - 1]
          : items[activeItemIdx - 1],
      );
    }

    if (!duration) {
      if ((activeItemIdx + 1) * itemHeight > visibleHeight) {
        this.itemsWrap.scroll({
          top: (activeItemIdx + 1) * itemHeight - visibleHeight,
        });
      }
    }
  };

  handleToggleExpand = (e: any): void => {
    const { onClick } = this.props;
    const isButtonClick = this.button && this.button.contains(e.target);
    const isItemsWrap = this.itemsWrap && this.itemsWrap.contains(e.target);
    const isItems = this.items && this.items.contains(e.target);

    if (e.keyCode === 40 || e.keyCode === 38) {
      return;
    }

    if (isButtonClick && !isItems && !isItemsWrap) {
      this.setState(
        (prevState: StateType) => ({
          isExpanded: !prevState.isExpanded,
          isSelectUse: prevState.isExpanded ? null : this.button,
        }),
        onClick,
      );
      return;
    }

    if (e.keyCode === 27 || (!isButtonClick && !isItems) || isItemsWrap) {
      this.setState({ isExpanded: false, isSelectUse: null });
    }
  };

  handleItemClick = (e: any): void => {
    const { onSelect, items } = this.props;
    if (this.props && onSelect) {
      onSelect(find(propEq('id', e.target.id))(items));
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
        {((label && !isBirthdate) || !(isBirthdate && activeItem)) && (
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
                    data-test={`${dataTest}_items`}
                  >
                    {item.label}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {(forForm || forSearch || isBirthdate) && <div styleName="hr" />}
      </div>
    );
  }
}

export default Select;
