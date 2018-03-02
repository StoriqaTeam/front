// @flow

import React, { Component } from 'react';

import { noScroll } from 'utils';
import { Icon } from 'components/Icon';

import Portal from './Portal';

import './Modal.scss';

type PropsTypes = {
  children: any,
  showModal: ?boolean,
  onClose: Function,
};

type StateTypes = {
  showModal: ?boolean,
};

class Modal extends Component<PropsTypes, StateTypes> {
  state = {
    showModal: false,
  };

  componentWillMount() {
    this.setState({ showModal: this.props.showModal });

    window.addEventListener('keydown', this.handleKeydown);
  }

  componentWillReceiveProps(nextProps: Object) {
    const { showModal } = nextProps;

    if (this.props.showModal !== showModal) {
      this.setState(
        { showModal },
        () => { this.toggleScroll(showModal); },
      );
    }
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeydown);
  }

  onCloseModal = () => {
    this.props.onClose();
  };

  toggleScroll = (showModal: ?boolean) => {
    if (showModal) {
      noScroll.on();
    } else {
      noScroll.off();
    }
  }

  handleKeydown = (e: any) => {
    if (e.keyCode === 27) {
      this.props.onClose();
    }
  };

  render() {
    if (!this.state.showModal) return null;

    return (
      <Portal>
        <div styleName="container">
          <div styleName="wrap">
            <div styleName="inner">
              <div
                styleName="close"
                onClick={this.onCloseModal}
                onKeyDown={() => {}}
                role="button"
                tabIndex="0"
              >
                <Icon type="cross" />
              </div>
              {this.props.children}
            </div>
          </div>
        </div>
      </Portal>
    );
  }
}

export default Modal;
