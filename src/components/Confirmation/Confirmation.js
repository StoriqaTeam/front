// @flow strict

import React, { PureComponent } from 'react';

import { Button } from 'components/common/Button';

import './Confirmation.scss';

type PropsType = {
  title: string,
  description: string,
  confirmText: string,
  cancelText: string,
  onConfirm: () => void,
  onCancel: () => void,
};

class Confirmation extends PureComponent<PropsType> {
  static defaultProps = {
    description: '',
    onConfirm: () => {},
    onCancel: () => {},
  };

  render() {
    const { confirmText, cancelText, onCancel, onConfirm, title, description } = this.props;
    return (
      <aside styleName="container">
        <h2 styleName="title">{title}</h2>
        <p styleName="description">{description}</p>
        <div styleName="buttons">
          <Button wireframe big onClick={onCancel} dataTest="cancel">
            {cancelText}
          </Button>
          <Button big onClick={onConfirm} pink dataTest="confirm">
            {confirmText}
          </Button>
        </div>
      </aside>
    );
  }
}

export default Confirmation;
