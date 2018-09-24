// @flow strict

import React, { Component } from 'react';
import type { Node } from 'react';
import { isEmpty, isNil } from 'ramda';
import classNames from 'classnames';

import { Icon } from 'components/Icon';

import './PopUpWrapper.scss';

type PropsType = {
  title: string,
  description: string,
  render: () => Node,
  onClose?: () => void,
};

class PopUpWrapper extends Component<PropsType> {
  static defaultProps = {
    description: '',
  };
  click = () => {};
  render() {
    const { title, description, onClose } = this.props;
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
        {isNil(onClose) ? null : closeButton}
        <h2
          styleName={classNames('title', {
            hasDescription: !isEmpty(description),
          })}
        >
          {title}
        </h2>
        {isEmpty(description) ? null : (
          <p styleName="description">{description}</p>
        )}
        {this.props.render()}
      </aside>
    );
  }
}

export default PopUpWrapper;
