// @flow

import React, { PureComponent } from 'react';
import classNames from 'classnames';

import './Col.scss';

type PricesTypes = {
  children: any,
  size: number,
}

class Col extends PureComponent<PricesTypes> {
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
