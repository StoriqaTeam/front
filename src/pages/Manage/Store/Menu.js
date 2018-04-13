// @flow

import React, { PureComponent } from 'react';
import classNames from 'classnames';
import MultiClamp from 'react-multi-clamp';

import menuItems from './menuItems.json';

import './Menu.scss';

type PropsType = {
  activeItem: string,
  switchMenu: Function,
};

type StateType = {
  //
};

class Menu extends PureComponent<PropsType, StateType> {
  render() {
    const { activeItem } = this.props;

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
            {'The long name of the store that already does not fit into two lines'}
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
