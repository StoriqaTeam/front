// @flow

import * as React from 'react';
import classNames from 'classnames';

import { Icon } from 'components/Icon';

import './Modal.scss';

type ModalType = {
  children: React.Element<*>,
  showModal: boolean,
  onClose: () => void,
  dark?: boolean,
};

const Modal = ({ dark, children, showModal, onClose }: ModalType) => {
  if (!showModal) {
    return null;
  }
  return (
    <div styleName={classNames('modalWrapper', { dark })}>
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

Modal.defaultProps = {
  dark: false,
};

export default Modal;
