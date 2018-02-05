// @flow

import React, { PureComponent } from 'react';
import type { Node } from 'react';

import './Form.scss';

type PropsType = {
  wrapperClass: string,
  onSubmit: Function,
  children: Node,
}

class Form extends PureComponent<PropsType> {
  static defaultProps = {
    wrapperClass: 'container',
  };

  /**
   * @desc handles onSubmit event
   * @return {void}
   */
  handleSubmit = (evt: SyntheticEvent<HTMLFormElement>) => {
    // prevent the browser from refreshing when the form is submitted.
    evt.preventDefault();
    // extract the callBack that's given from the parent.
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
