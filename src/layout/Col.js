// @flow

import React, { PureComponent } from 'react';
import classNames from 'classnames';

import './Col.scss';

type PropsTypes = {
  children: any,
  size: number,
}

class Col extends PureComponent<PropsTypes> {
  render() {
    const { size } = this.props;

    return (
      <div styleName={classNames('col', { [`col-${size}`]: size })}>
        { this.props.children }
      </div>
    );
  }
}

export default Col;
