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

type SelectType = {
  id: string,
  label: string,
};

type PropsType = {
  isDropdown: ?boolean,
  transparent: ?boolean,
  items: Array<{ id: string, label: string, opacity: boolean }>,
  onSelect?: (item: ?SelectType) => void,
  title: ?string,
  label: ?string,
  activeItem: ?{ id: string, label: string },
  forForm: ?boolean,
  forSearch: ?boolean,
  forAutocomlete: ?boolean,
  fullWidth: ?boolean,
  containerStyle: ?{
    [name: string]: any,
  },
};

class MiniSelect extends Component<PropsType, StateType> {
  state = {
    isExpanded: false,
  };

  componentWillMount() {
    if (process.env.BROWSER) {
      window.addEventListener('click', this.handleToggleExpand);
      window.addEventListener('keydown', this.handleToggleExpand);
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

  handleToggleExpand = (e: any) => {
    const isButtonClick = this.button && this.button.contains(e.target);
    const isItemsWrap = this.itemsWrap && this.itemsWrap.contains(e.target);
    const isItems = this.items && this.items.contains(e.target);

    if (isButtonClick && !isItems && !isItemsWrap) {
      this.setState({ isExpanded: !this.state.isExpanded });
      return;
    }

    if (e.keyCode === 27 || (!isButtonClick && !isItems) || isItemsWrap) {
      this.setState({ isExpanded: false });
    }
  };

  handleItemClick = (e: any) => {
    if (this.props.isDropdown) {
      log.info('id', e.target.id);
    } else if (this.props && this.props.onSelect) {
      // $FlowIgnoreMe
      this.props.onSelect(find(propEq('id', e.target.id))(this.props.items));
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
      forForm,
      fullWidth,
      forSearch,
      forAutocomlete,
      containerStyle,
    } = this.props;
    const { isExpanded } = this.state;

    return (
      <div
        ref={node => {
          this.button = node;
        }}
        styleName={classNames('container', {
          isDropdown,
          forForm,
          forSearch,
          forAutocomlete,
          fullWidth,
        })}
        style={containerStyle}
      >
        {label && <div styleName={classNames('label')}>{label}</div>}
        <div styleName={classNames('wrap', { transparent })}>
          <div styleName="selected">
            {isDropdown ? title : activeItem && activeItem.label}
          </div>
          <div styleName="icon">
            <Icon type="arrowExpand" />
          </div>
          <div
            ref={node => {
              this.items = node;
            }}
            styleName={classNames('items', {
              hidden: !isExpanded,
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
            >
              {items.map(item => {
                const { id } = item;
                return (
                  <div
                    key={id}
                    id={id}
                    styleName={classNames('item', {
                      active: activeItem && activeItem.id === id,
                      opaque: item.opacity,
                    })}
                    data-test={id}
                  >
                    {item.label}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {(forForm || forSearch) && <div styleName="hr" />}
      </div>
    );
  }
}

export default MiniSelect;
