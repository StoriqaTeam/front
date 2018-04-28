// @flow

import React, { Component } from 'react';
import classNames from 'classnames';

import { Icon } from 'components/Icon';
import Portal from 'components/Modal/Portal';

import Sad from './svg/sad.svg';
import Merry from './svg/merry.svg';

import './Alert.scss';

type PropsTypes = {
  showAlert: ?boolean,
  text: string,
  isError: ?boolean,
};

type StateTypes = {
  showAlert: ?boolean,
};

class Alert extends Component<PropsTypes, StateTypes> {
  state = {
    showAlert: false,
  };

  componentWillMount() {
    this.setState({ showAlert: this.props.showAlert });
  }

  componentWillReceiveProps(nextProps: Object) {
    const { showAlert: nextShowAlert, isError: nextIsError } = nextProps;

    if (
      this.props.showAlert !== nextShowAlert ||
      nextIsError !== this.props.isError
    ) {
      this.setState(prevState => {
        if (prevState.showAlert !== nextShowAlert) {
          return { showAlert: nextShowAlert };
        }
        return {};
      });
    }
  }

  onCloseModal = () => {
    this.setState({ showAlert: false });
  };

  render() {
    if (!this.state.showAlert) return null;

    const { text, isError } = this.props;

    return (
      <Portal>
        <div styleName={classNames('container', { isError })}>
          <div styleName="wrap">
            <div styleName="inner">
              {isError ? <Sad styleName="icon" /> : <Merry styleName="icon" />}
              <div styleName="text">{text}</div>
              <div
                styleName="cross"
                onClick={this.onCloseModal}
                onKeyDown={() => {}}
                role="button"
                tabIndex="0"
              >
                <Icon type="crossWhite" />
              </div>
            </div>
          </div>
        </div>
      </Portal>
    );
  }
}

export default Alert;
