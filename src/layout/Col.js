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
  hidden?: boolean, // Hidden: all
  smHidden?: boolean, // Hidden: >= 576
  mdHidden?: boolean, // Hidden: >= 768
  lgHidden?: boolean, // Hidden: >= 992
  xlHidden?: boolean, // Hidden: >= 1200
  visible?: boolean, // Hidden: all
  smVisible?: boolean, // Visible: >= 576
  mdVisible?: boolean, // Visible: >= 768
  lgVisible?: boolean, // Visible: >= 992
  xlVisible?: boolean, // Visible: >= 1200
};

class Col extends PureComponent<PropsTypes> {
  render() {
    const {
      size,
      sm,
      md,
      lg,
      xl,
      hidden,
      smHidden,
      mdHidden,
      lgHidden,
      xlHidden,
      visible,
      smVisible,
      mdVisible,
      lgVisible,
      xlVisible,
    } = this.props;
    return (
      <div
        styleName={classNames('col', {
          // $FlowIgnoreMe
          [`d-none`]: hidden,
          // $FlowIgnoreMe
          [`d-none d-sm-flex`]: smHidden,
          // $FlowIgnoreMe
          [`d-sm-none d-md-flex`]: mdHidden,
          // $FlowIgnoreMe
          [`d-lg-none d-xl-flex`]: lgHidden,
          // $FlowIgnoreMe
          [`d-xl-none`]: xlHidden,
          // $FlowIgnoreMe
          [`d-flex`]: visible,
          // $FlowIgnoreMe
          [`d-none d-sm-flex d-md-none`]: smVisible,
          // $FlowIgnoreMe
          [`d-none d-md-flex d-lg-none`]: mdVisible,
          // $FlowIgnoreMe
          [`d-none d-lg-flex d-xl-none`]: lgVisible,
          // $FlowIgnoreMe
          [`d-none d-xl-flex`]: xlVisible,
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
