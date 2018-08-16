// @flow

import React, { Component } from 'react';
import type { Node } from 'react';

import { Icon } from 'components/Icon';

import './PopUpWrapper.scss';

type PropsType = {
  title: string,
  render: () => Node,
  onClose: () => any,
};

class PopUpWrapper extends Component<PropsType> {
  click = () => {};
  render() {
    const { title, onClose } = this.props;
    const closeButton = (
      <div
        styleName="close"
        onClick={onClose}
        onKeyDown={() => {}}
        role="button"
        tabIndex="0"
      >
        <Icon type="cross" />
      </div>
    );
    return (
      <aside styleName="container">
        {closeButton}
        <h2 styleName="title">{title}</h2>
        {this.props.render()}
      </aside>
    );
  }
}

export default PopUpWrapper;
