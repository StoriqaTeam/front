// @flow strict

import React, { PureComponent } from 'react';
import type { Node } from 'react';

import { Button } from 'components/common/Button';
import { Modal } from 'components/Modal';

import './Confirmation.scss';

type PropsType = {
  title: string,
  description: string,
  confirmText: string,
  cancelText: string,
  showModal: boolean,
  onConfirm: () => void,
  onCancel: () => void,
  handleCloseModal: () => void,
  children?: Node,
  disableConfirm?: boolean,
};

class Confirmation extends PureComponent<PropsType> {
  static defaultProps = {
    showModal: false,
    description: '',
    onConfirm: () => {},
    onCancel: () => {},
    handleCloseModal: () => {},
    disableConfirm: false,
    children: undefined,
  };

  render() {
    const {
      confirmText,
      cancelText,
      onCancel,
      onConfirm,
      handleCloseModal,
      title,
      description,
      showModal,
      disableConfirm,
      children,
    } = this.props;
    return (
      <Modal
        showModal={showModal}
        onClose={handleCloseModal}
        render={() => (
          <aside styleName="container" data-test="confirmationPopup">
            <h2 styleName="title">{title}</h2>
            <p styleName="description">{description}</p>
            {children != null && <div styleName="body">{children}</div>}
            <div styleName="buttons">
              <Button wireframe big onClick={onCancel} dataTest="cancel">
                {cancelText}
              </Button>
              <Button
                big
                onClick={onConfirm}
                pink
                disabled={disableConfirm}
                dataTest="confirm"
              >
                {confirmText}
              </Button>
            </div>
          </aside>
        )}
      />
    );
  }
}

export default Confirmation;
