// @flow

import React from 'react';

import { Modal } from 'components/Modal';

import './PaymentPopup.scss';

type PropsType = {
  onCloseClicked: () => void,
  isShown: boolean,
  url: string,
};

const PaymentPopup = (props: PropsType) => (
  <Modal showModal={props.isShown} onClose={props.onCloseClicked}>
    <iframe
      styleName="iframe"
      width="624"
      height="542"
      src={props.url}
      title="payment-popup"
      scrolling="no"
      frameBorder="no"
    />
  </Modal>
);

export default PaymentPopup;
