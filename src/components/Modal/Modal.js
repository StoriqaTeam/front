// @flow

import React, { PureComponent, Fragment } from 'react';
import type { Node } from 'react';
import { isNil } from 'ramda';

import { noScroll } from 'utils';
import { Icon } from 'components/Icon';

import Portal from './Portal';

import './Modal.scss';

type PropsTypes = {
  children?: any,
  showModal: ?boolean,
  onClose: Function,
  render?: ?() => Node,
};

// type StateTypes = {
//   showModal: ?boolean,
// };

class Modal extends PureComponent<PropsTypes> {
  static defaultProps = {
    render: null,
  };
  // state = {
  //   showModal: false,
  // };

  componentWillMount() {
    // this.setState({ showModal: this.props.showModal });

    if (process.env.BROWSER) {
      window.addEventListener('keydown', this.handleKeydown);
    }
  }
  /**
    TODO: momentary comment while is fixed when the Modal is already UNMOUNT!
   */
  // componentWillReceiveProps(nextProps: Object) {
  //   const { showModal } = nextProps;

  //   if (this.props.showModal !== showModal) {
  //     this.setState({ showModal }, () => {
  //       this.toggleScroll(showModal);
  //     });
  //   }
  // }

  componentWillUnmount() {
    if (process.env.BROWSER) {
      window.removeEventListener('keydown', this.handleKeydown);
    }
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
  };

  handleKeydown = (e: any) => {
    if (e.keyCode === 27) {
      this.props.onClose();
    }
  };

  handleClick = (e: any): void => {
    const { onClose } = this.props;
    const {
      target: { id },
    } = e;
    if (id === 'overlay' || id === 'inner') {
      onClose();
    }
  };

  render() {
    if (!this.props.showModal) return null;
    const closeButton = (
      <div
        styleName="close"
        onClick={this.onCloseModal}
        onKeyDown={() => {}}
        role="button"
        tabIndex="0"
      >
        <Icon type="cross" />
      </div>
    );
    return (
      <Portal>
        <div styleName="container">
          <div
            id="overlay"
            onClick={this.handleClick}
            onKeyDown={() => {}}
            role="button"
            styleName="wrap"
            tabIndex="0"
          >
            <div id="inner" styleName="inner">
              {isNil(this.props.render) ? (
                <Fragment>
                  <div styleName="body">
                    {closeButton}
                    {this.props.children}
                  </div>
                </Fragment>
              ) : (
                this.props.render()
              )}
            </div>
          </div>
        </div>
      </Portal>
    );
  }
}

export default Modal;
