// @flow

import React, { PureComponent } from 'react';
import classNames from 'classnames';

import './Col.scss';

type PropsTypes = {
  children: any,
  size?: number, // Size layout column: < 576
  sm?: number | 'auto', // Size layout column: >= 576
  md?: number | 'auto', // Size layout column: >= 768
  lg?: number | 'auto', // Size layout column: >= 992
  xl?: number | 'auto', // Size layout column: >= 1200
};

class Col extends PureComponent<PropsTypes> {
  render() {
    const { size, sm, md, lg, xl } = this.props;

    return (
      <div
        styleName={classNames('col', {
          // $FlowIgnoreMe
          [`col-${size || 12}`]: true,
          // $FlowIgnoreMe
          [`col-sm col-sm-${sm}`]: sm,
          // $FlowIgnoreMe
          [`col-md col-md-${md}`]: md,
          // $FlowIgnoreMe
          [`col-lg col-lg-${lg}`]: lg,
          // $FlowIgnoreMe
          [`col-xl col-xl-${xl}`]: xl,
        })}
      >
        {this.props.children}
      </div>
    );
  }
}

export default Col;
