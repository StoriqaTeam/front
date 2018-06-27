// @flow

import React, { PureComponent } from 'react';
import { addIndex, map } from 'ramda';

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
  dateStringFromTimestamp = (timestamp: number) => '8 nov 2017 08:12';

  renderTitle = () => (
    <div styleName="headerContainer">
      <span styleName="headerDate">Date</span>
      <span styleName="headerManager">Manager</span>
      <span styleName="headerStatus">Status</span>
      <span styleName="headerAdditionalInfo">Additional info</span>
      <div styleName="border" />
    </div>
  );

  renderRows = (items: Array<OrderStatusType>) => {
    const indexedMap = addIndex(map);
    return indexedMap(
      (item: OrderStatusType, idx: number) => (
        <div styleName="rowContainer" key={`order-status-${idx}`}>
          <div styleName="rowDate">
            {this.dateStringFromTimestamp(item.date)}
          </div>
          <div styleName="rowManager">{item.manager}</div>
          <div styleName="rowStatus">{item.status}</div>
          <div styleName="rowAdditionalInfo">{item.additionalInfo || '--'}</div>
          <div styleName="borderRow" />
        </div>
      ),
      items,
    );
  };

  render() {
    const { items } = this.props;
    return (
      <div styleName="container">
        <div styleName="title">STATUS HISTORY</div>
        {this.renderTitle()}
        {this.renderRows(items)}
      </div>
    );
  }
}

export default StatusList;
