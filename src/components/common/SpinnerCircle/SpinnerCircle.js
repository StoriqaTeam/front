// @flow strict

import React, { Fragment } from 'react';
import classNames from 'classnames';

import './SpinnerCircle.scss';

type PropsType = {
  additionalStyles?: { [string]: number | string | boolean },
  containerStyles?: { [string]: number | string | boolean },
  forPaid?: boolean,
  small?: boolean,
  //
};

const SpinnerCircle = (props: PropsType) => (
  <Fragment>
    {props.forPaid === true ? (
      <div styleName={classNames('paidSpinner', { small: props.small })} />
    ) : (
      <div styleName="container" style={props.containerStyles || {}}>
        <div styleName="spinner" style={props.additionalStyles || {}} />
      </div>
    )}
  </Fragment>
);

SpinnerCircle.defaultProps = {
  additionalStyles: undefined,
  containerStyles: undefined,
  forPaid: undefined,
  small: undefined,
};

export default SpinnerCircle;
