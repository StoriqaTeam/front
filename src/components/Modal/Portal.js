// @flow

import { Component } from 'react';
import ReactDom from 'react-dom';

type PropsType = {
  children: any,
};

class Portal extends Component<PropsType> {
  componentWillMount() {
    if (process.env.BROWSER) {
      this.popup = document.createElement('div');

      if (document.body) {
        document.body.appendChild(this.popup);
      }
    }
  }

  componentWillUnmount() {
    if (process.env.BROWSER) {
      if (document.body) {
        document.body.removeChild(this.popup);
      }
    }
  }

  popup: any;

  render() {
    if (process.env.BROWSER) {
      return ReactDom.createPortal(this.props.children, this.popup);
    }
    return null;
  }
}

export default Portal;
