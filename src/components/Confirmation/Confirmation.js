// @flow strict

import React, { PureComponent } from 'react';

import { Button } from 'components/common/Button';

import './Confirmation.scss';

import t from './i18n';

type PropsType = {
  title: string,
  description: string,
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
    const { onCancel, onConfirm, title, description } = this.props;
    return (
      <aside styleName="container">
        <h2 styleName="title">{title}</h2>
        <p styleName="description">{description}</p>
        <div styleName="buttons">
          <Button wireframe big onClick={onCancel} dataTest="cancel">
            {t.cancel}
          </Button>
          <Button big onClick={onConfirm} pink dataTest="confirm">
            {t.deletePlease}
          </Button>
        </div>
      </aside>
    );
  }
}

export default Confirmation;
