// @flow

import React, { PureComponent } from 'react';
import classNames from 'classnames';
import MultiClamp from 'react-multi-clamp';

import './Menu.scss';

type PropsType = {
  menuItems: Array<{ id: string, title: string }>,
  activeItem: string,
  switchMenu: Function,
};

type StateType = {
  //
};

class Menu extends PureComponent<PropsType, StateType> {
  render() {
    const { menuItems, activeItem } = this.props;

    return (
      <div styleName="menu">
        <div styleName="imgWrap">
          <img
            src="http://southasia.oneworld.net/ImageCatalog/no-image-icon/image"
            styleName="img"
            alt="img"
          />
        </div>
        <div styleName="title">
          <MultiClamp ellipsis="..." clamp={2}>
            {'Длинное название магазина что аж не влезает в две строки'}
          </MultiClamp>
        </div>
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
