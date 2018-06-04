// @flow

import React, { PureComponent } from 'react';
import classNames from 'classnames';

import './Col.scss';

type PropsTypes = {
  children: any,
  size: number, // Size layout's column
  ds?: string, // ds: Device Size
};

class Col extends PureComponent<PropsTypes> {
  render() {
    const { size, ds } = this.props;
    const dsString = ds ? `-${ds}` : '';

    return (
      <div styleName={classNames('col', { [`col${dsString}-${size}`]: true })}>
        {this.props.children}
      </div>
    );
  }
}

export default Col;
