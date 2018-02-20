// @flow

import React, { Component } from 'react';
import classNames from 'classnames';
import { find, propEq } from 'ramda';

import { log } from 'utils';
import { Icon } from 'components/Icon';

import './MiniSelect.scss';

type StateType = {
  activeItem: ?{ id: string, label: string },
  isExpanded: boolean,
};

type PropsType = {
  isItem: boolean,
  isDropdawn: boolean,
  items: Array<{ id: number, label: string }>,
  onSelect?: (id: number) => void,
  label: ?string,
};

class MiniSelect extends Component<PropsType, StateType> {
  state = {
    activeItem: null,
    isExpanded: false,
  };

  componentWillMount() {
    this.setState({ activeItem: this.props.items[0] });
    window.addEventListener('click', this.handleToggleExpand);
    window.addEventListener('keydown', this.handleToggleExpand);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.handleToggleExpand);
    window.removeEventListener('keydown', this.handleToggleExpand);
  }

  handleToggleExpand = (e) => {
    const isButtonClick = this.button.contains(e.target);
    const isItemsWrap = this.itemsWrap.contains(e.target);
    const isItems = this.items.contains(e.target);

    if (isButtonClick && !isItems && !isItemsWrap) {
      this.setState({ isExpanded: !this.state.isExpanded });
      return;
    }

    if ((e.keyCode === 27) || (!isButtonClick && !isItems) || isItemsWrap) {
      this.setState({ isExpanded: false });
    }
  };

  handleItemClick = (e) => {
    if (this.props.isDropdawn) {
      log.info('id', e.target.id);
    } else {
      const activeItem = find(propEq('id', e.target.id))(this.props.items);
      if (activeItem) {
        this.setState({ activeItem });
        const { onSelect } = this.props;

        if (onSelect) {
          onSelect(activeItem);
        }
      }
    }
  };

  render() {
    const {
      items,
      isItem,
      isDropdawn,
      label,
    } = this.props;
    const { isExpanded, activeItem } = this.state;

    return (
      <div
        ref={(node) => { this.button = node; }}
        styleName={classNames('container', { isItem, isDropdawn })}
      >
        <div styleName="selected">
          { isDropdawn ? label : activeItem.label }
        </div>
        <div styleName="icon">
          <Icon type="arrowExpand" />
        </div>
        <div
          ref={(node) => { this.items = node; }}
          styleName={classNames('items', {
            hidden: !isExpanded,
          })}
        >
          <div
            ref={(node) => { this.itemsWrap = node; }}
            styleName="wrap"
            onClick={this.handleItemClick}
            onKeyDown={() => {}}
            role="button"
            tabIndex="0"
          >
            {items.map((item) => {
              const { id } = item;
              return (
                <div
                  key={id}
                  id={id}
                  styleName={classNames('item', { active: activeItem.id === id })}
                >
                  {item.label}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default MiniSelect;
