// @flow

import React, { PureComponent } from 'react';

import { noScroll } from 'utils';
import { Icon } from 'components/Icon';

import Portal from './Portal';

import './Modal.scss';

type PropsTypes = {
  children: any,
  showModal: ?boolean,
  onClose: Function,
};

class Modal extends PureComponent<PropsTypes> {
  state = {
    showModal: false,
  };

  componentWillMount() {
    this.setState({ showModal: this.props.showModal });

    document.addEventListener('click', this.onClickPast);
    document.addEventListener('keydown', this.handleKeydown);
  }

  componentWillReceiveProps({ showModal }) {
    if (this.props.showModal !== showModal) {
      this.setState(
        { showModal },
        () => { this.toggleScroll(showModal); },
      );
    }
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onClickPast);
    document.removeEventListener('keydown', this.handleKeydown);
  }

  onClickPast = (e) => {
    const isContainerClick = this.container && this.container.contains(e.target);
    const isInnerClick = this.inner && this.inner.contains(e.target);

    if (isContainerClick && !isInnerClick) {
      this.props.onClose();
    }
  };

  onCloseModal = () => {
    this.props.onClose();
  };

  toggleScroll = (showModal) => {
    if (showModal) {
      noScroll.on();
    } else {
      noScroll.off();
    }
  }

  handleKeydown = (e) => {
    if (e.keyCode === 27) {
      this.props.onClose();
    }
  };

  render() {
    if (!this.state.showModal) return null;

    return (
      <Portal>
        <div
          ref={(node) => { this.container = node; }}
          styleName="container"
        >
          <div styleName="wrap">
            <div
              ref={(node) => { this.inner = node; }}
              styleName="inner"
            >
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
