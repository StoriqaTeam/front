// @flow

import React, { PureComponent } from 'react';

import './Form.scss';

type PropsType = {
  wrapperClass: string,
  onSubmit: Function,
  children: Array
}

class Form extends PureComponent<PropsType> {
  static defaultProps = {
    wrapperClass: 'container',
  };

  /**
   * @desc handles onSubmit event
   */
  handleSubmit = (evt) => {
    evt.preventDefault();
    const { onSubmit } = this.props;
    onSubmit();
  };

  render() {
    const { wrapperClass, children } = this.props;
    return (
      <form styleName={wrapperClass} noValidate onSubmit={this.handleSubmit}>
        { children }
      </form>
    );
  }
}

export default Form;
