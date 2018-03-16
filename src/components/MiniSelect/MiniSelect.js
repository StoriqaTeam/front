// @flow

import React, { Component } from 'react';
import classNames from 'classnames';
import { find, propEq } from 'ramda';

import { log } from 'utils';
import { Icon } from 'components/Icon';

import './MiniSelect.scss';

type StateType = {
  isExpanded: boolean,
};

type PropsType = {
  isDropdown: ?boolean,
  transparent: ?boolean,
  items: Array<{ id: string, label: string }>,
  onSelect?: (id: number) => void,
  title: ?string,
  label: ?string,
  activeItem: ?{ id: string, label: string },
};

class MiniSelect extends Component<PropsType, StateType> {
  state = {
    isExpanded: false,
  };

  componentWillMount() {
    window.addEventListener('click', this.handleToggleExpand);
    window.addEventListener('keydown', this.handleToggleExpand);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.handleToggleExpand);
    window.removeEventListener('keydown', this.handleToggleExpand);
  }

  button: any;
  itemsWrap: any;
  items: any;

  handleToggleExpand = (e: any) => {
    const isButtonClick = this.button && this.button.contains(e.target);
    const isItemsWrap = this.itemsWrap && this.itemsWrap.contains(e.target);
    const isItems = this.items && this.items.contains(e.target);

    if (isButtonClick && !isItems && !isItemsWrap) {
      this.setState({ isExpanded: !this.state.isExpanded });
      return;
    }

    if ((e.keyCode === 27) || (!isButtonClick && !isItems) || isItemsWrap) {
      this.setState({ isExpanded: false });
    }
  };

  handleItemClick = (e: any) => {
    if (this.props.isDropdown) {
      log.info('id', e.target.id);
    } else {
      const activeItem = find(propEq('id', e.target.id))(this.props.items);
      const { onSelect } = this.props;
      onSelect(activeItem);
    }
  };

  render() {
    const {
      items,
      isDropdown,
      title,
      transparent,
      label,
      activeItem,
    } = this.props;
    const { isExpanded } = this.state;

    return (
      <div
        ref={(node) => { this.button = node; }}
        styleName={classNames('container', { isDropdown })}
      >
        {label && <div styleName="label">{label}</div>}
        <div styleName={classNames('wrap', { transparent })}>
          <div styleName="selected">
            { isDropdown ? title : activeItem && activeItem.label }
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
              styleName="itemsWrap"
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
                    styleName={classNames('item', { active: activeItem && activeItem.id === id })}
                  >
                    {item.label}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MiniSelect;
