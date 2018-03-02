// @flow

import { Component } from 'react';
import ReactDom from 'react-dom';

type PropsType = {
  children: any,
};

class Portal extends Component<PropsType> {
  componentWillMount() {
    this.popup = document.createElement('div');

    if (document.body) {
      document.body.appendChild(this.popup);
    }
  }

  componentWillUnmount() {
    if (document.body) {
      document.body.removeChild(this.popup);
    }
  }

  popup: any;

  render() {
    return ReactDom.createPortal(this.props.children, this.popup);
  }
}

export default Portal;
