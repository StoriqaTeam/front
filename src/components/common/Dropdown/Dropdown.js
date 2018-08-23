// @flow

import React, { Component } from 'react';
import classNames from 'classnames';

import { Icon } from 'components/Icon';

import './Dropdown.scss';

type StateType = {
  isExpanded: boolean,
};

type PropsType = {
  items: Array<{ id: string, label: string }>,
  title: ?string,
};

class Select extends Component<PropsType, StateType> {
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

  render() {
    const { items, title } = this.props;
    const { isExpanded } = this.state;

    return (
      <div
        ref={node => {
          this.button = node;
        }}
        styleName="container"
      >
        <div styleName="wrap">
          <div styleName="selected">{title}</div>
          <div styleName={classNames('icon', { rotateIcon: isExpanded })}>
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
              onKeyDown={() => {}}
              role="button"
              tabIndex="0"
            >
              {items.map(item => {
                const { id } = item;
                return (
                  <div key={id} id={id} styleName="item">
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

export default Select;
