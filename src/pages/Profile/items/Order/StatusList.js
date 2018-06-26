// @flow

import React, { PureComponent } from 'react';

import './StatusList.scss';

export type OrderStatusType = {
  date: number,
  manager: string,
  status: string,
  additionalInfo?: string,
};

type PropsType = {
  items: Array<OrderStatusType>,
};

class StatusList extends PureComponent<PropsType> {
  renderTitle = () => (
    <div styleName="headerContainer">
      <span styleName="headerDate"> Date</span>
      <span styleName="headerManager">Manager</span>
      <span styleName="headerStatus">Status</span>
      <span styleName="headerAdditionalInfo">Additional info</span>
      <div styleName="border" />
    </div>
  );

  renderRows = (items: Array<OrderStatusType>) => <div />;

  render() {
    const { items } = this.props;
    return (
      <div styleName="container">
        <div styleName="title">STATUS HISTORY</div>
        {this.renderTitle()}
      </div>
    );
  }
}

export default StatusList;
