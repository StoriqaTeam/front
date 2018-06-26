// @flow

import React from 'react';

import './CheckoutSidebar.scss';

class CheckoutSidebar extends React.Component<PropsType> {
  state = {
    step: 1,
  };

  render() {
    const { step } = this.state;
    return <div styleName="container">Sidebar {step}</div>;
  }
}

export default CheckoutSidebar;
