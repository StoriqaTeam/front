// @flow

import React from 'react';

import { Icon } from 'components/Icon';

import './Modal.scss';

type ModalType = {
  children: Raact.Element,
  showModal: boolean,
  onClose: () => void,
};

const Modal = ({ children, showModal, onClose }: ModalType) => {
  if (!showModal) {
    return null;
  }
  return (
    <div styleName="modalWrapper">
      <div styleName="modal">
        <div styleName="modalContent">
          <div
            styleName="closeButton"
            role="button"
            onClick={onClose}
            onKeyDown={() => {}}
            tabIndex={0}
          >
            <Icon type="cross" />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
