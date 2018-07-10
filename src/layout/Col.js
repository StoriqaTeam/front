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
  smHiddenOnly?: boolean, // HiddenOnly: >= 576
  mdHiddenOnly?: boolean, // HiddenOnly: >= 768
  lgHiddenOnly?: boolean, // HiddenOnly: >= 992
  xlHiddenOnly?: boolean, // HiddenOnly: >= 1200
  smHidden?: boolean, // Hidden: >= 576
  mdHidden?: boolean, // Hidden: >= 768
  lgHidden?: boolean, // Hidden: >= 992
  xlHidden?: boolean, // Hidden: >= 1200
  visible?: boolean, // VisibleOnly: all
  smVisibleOnly?: boolean, // VisibleOnly: >= 576
  mdVisibleOnly?: boolean, // VisibleOnly: >= 768
  lgVisibleOnly?: boolean, // VisibleOnly: >= 992
  xlVisibleOnly?: boolean, // VisibleOnly: >= 1200
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
      smHiddenOnly,
      mdHiddenOnly,
      lgHiddenOnly,
      xlHiddenOnly,
      visible,
      smVisible,
      mdVisible,
      lgVisible,
      xlVisible,
      smVisibleOnly,
      mdVisibleOnly,
      lgVisibleOnly,
      xlVisibleOnly,
    } = this.props;
    return (
      <div
        styleName={classNames('col', {
          [`d-none`]: hidden,
          [`d-sm-none d-md-block`]: smHiddenOnly,
          [`d-sm-none d-md-flex`]: mdHiddenOnly,
          [`d-lg-none d-xl-flex`]: lgHiddenOnly,
          [`d-sm-none`]: smHidden,
          [`d-md-flex`]: mdHidden,
          [`d-lg-none`]: lgHidden,
          [`d-xl-none`]: xlHiddenOnly || xlHidden,
          [`d-flex`]: visible,
          [`d-none d-sm-flex d-md-none`]: smVisibleOnly,
          [`d-none d-md-flex d-lg-none`]: mdVisibleOnly,
          [`d-none d-lg-flex d-xl-none`]: lgVisibleOnly,
          [`d-none d-sm-flex`]: smVisible,
          [`d-none d-md-flex`]: mdVisible,
          [`d-none d-lg-flex`]: lgVisible,
          [`d-none d-xl-flex`]: xlVisibleOnly || xlVisible,
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
