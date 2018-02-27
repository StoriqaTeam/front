// @flow

import { Component } from 'react';
import ReactDom from 'react-dom';

type PropsType = {
  children: any,
};

const useCreatePortal = typeof ReactDom.createPortal === 'function';

class Portal extends Component<PropsType> {
  componentWillMount() {
    this.popup = document.createElement('div');

    if (document.body) {
      document.body.appendChild(this.popup);
    }

    this.renderLayer();
  }

  componentDidUpdate() {
    this.renderLayer();
  }

  componentWillUnmount() {
    if (!useCreatePortal) {
      ReactDom.unmountComponentAtNode(this.popup);
    }

    if (document.body) {
      document.body.removeChild(this.popup);
    }
  }

  popup: any;

  renderLayer() {
    if (!useCreatePortal) {
      ReactDom.unstable_renderSubtreeIntoContainer(this, this.props.children, this.popup);
    }
  }

  render() {
    if (useCreatePortal) {
      return ReactDom.createPortal(this.props.children, this.popup);
    }
    return null;
  }
}

export default Portal;
