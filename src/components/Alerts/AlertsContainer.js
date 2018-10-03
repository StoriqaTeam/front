// @flow strict

import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { map } from 'ramda';

import { Alert } from './index';

import type { AlertPropsType } from './types';

const alertsRootDiv = process.env.BROWSER
  ? document.getElementById('alerts-root')
  : null;

type PropsType = {
  alerts: Array<AlertPropsType>,
};

class AlertsContainer extends PureComponent<PropsType> {
  renderAlerts = map(alertProps => (
    <Alert key={alertProps.createdAtTimestamp} {...alertProps} />
  ));

  render() {
    return alertsRootDiv
      ? ReactDOM.createPortal(
          this.renderAlerts(this.props.alerts),
          alertsRootDiv,
        )
      : null;
  }
}

export default AlertsContainer;
