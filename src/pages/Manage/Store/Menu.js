// @flow

import React, { PureComponent } from 'react';
import classNames from 'classnames';

import menuItems from './menuItems.json';

import './Menu.scss';

type PropsType = {
  activeItem: string,
  switchMenu: Function,
  storeName?: string,
  storeLogo?: string,
};

type StateType = {
  //
};

class Menu extends PureComponent<PropsType, StateType> {
  render() {
    const { activeItem, storeName, storeLogo } = this.props;

    return (
      <div styleName="menu">
        <div styleName="imgWrap">
          <img
            src={storeLogo || 'https://i.imgur.com/bY6A3Yz.jpg'}
            styleName="img"
            alt="img"
          />
        </div>
        {storeName && (
          <div styleName="title">
            {storeName}
          </div>
        )}
        <div styleName="items">
          {menuItems.map((item) => {
            const isActive = item.id === activeItem;

            return (
              <div
                key={item.id}
                styleName={classNames('item', { isActive })}
                onClick={() => { this.props.switchMenu(item.id); }}
                onKeyDown={() => {}}
                role="button"
                tabIndex="0"
              >
                { item.title }
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default Menu;
