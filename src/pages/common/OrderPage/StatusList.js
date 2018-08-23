// @flow

import React, { PureComponent } from 'react';
import { addIndex, map } from 'ramda';

import { StringLoadMore } from 'components/StringLoadMore';
import { timeFromTimestamp, shortDateFromTimestamp } from 'utils/formatDate';

import './StatusList.scss';

export type OrderStatusType = {
  date: string,
  manager: string,
  status: string,
  additionalInfo?: string,
};

type PropsType = {
  items: Array<OrderStatusType>,
};

class StatusList extends PureComponent<PropsType> {
  dateStringFromTimestamp = (timestamp: string) =>
    `${shortDateFromTimestamp(timestamp)} ${timeFromTimestamp(timestamp)}`;

  renderTitle = () => (
    <div styleName="headerContainer">
      <span styleName="headerDate">Date</span>
      <span styleName="headerManager">User</span>
      <span styleName="headerStatus">Status</span>
      <span styleName="headerAdditionalInfo">Additional info</span>
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
          <div styleName="rowAdditionalInfo">
            {item.additionalInfo ? (
              <StringLoadMore text={item.additionalInfo} />
            ) : (
              '—'
            )}
          </div>
        </div>
      ),
      items,
    );
  };

  render() {
    const { items } = this.props;
    return (
      <div styleName="container">
        <div styleName="title">
          <strong>Status history</strong>
        </div>
        {this.renderTitle()}
        {this.renderRows(items)}
      </div>
    );
  }
}

export default StatusList;
