// @flow

import React, { Component } from 'react';
import classNames from 'classnames';
import { find, propEq, prepend } from 'ramda';

import { Icon } from 'components/Icon';

import './Select.scss';

type StateType = {
  isExpanded: boolean,
  items: Array<{ id: string, label: string }>,
};

type PropsType = {
  transparent: ?boolean,
  items: Array<{ id: string, label: string }>,
  onSelect?: (item: ?SelectType) => void,
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
  withEmpty?: boolean,
  isBirthdate?: boolean,
  onClick: () => void,
  isMobile: boolean,
};

type SelectType = {
  id: string,
  label: string,
};

class Select extends Component<PropsType, StateType> {
  static defaultProps = {
    onClick: () => {},
    isMobile: false,
  };
  constructor(props: PropsType) {
    super(props);
    this.state = {
      isExpanded: false,
      items: props.items,
    };
  }

  componentWillMount() {
    const { items, withEmpty } = this.props;
    this.setState({
      items: withEmpty ? prepend({ id: '', label: '' }, items) : items,
    });
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

  handleToggleExpand = (e: any): void => {
    const { onClick } = this.props;
    const isButtonClick = this.button && this.button.contains(e.target);
    const isItemsWrap = this.itemsWrap && this.itemsWrap.contains(e.target);
    const isItems = this.items && this.items.contains(e.target);

    if (isButtonClick && !isItems && !isItemsWrap) {
      this.setState({ isExpanded: !this.state.isExpanded }, onClick);
      return;
    }

    if (e.keyCode === 27 || (!isButtonClick && !isItems) || isItemsWrap) {
      this.setState({ isExpanded: false });
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
