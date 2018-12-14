// @flow

import React, { PureComponent } from 'react';
import { addIndex, map, toLower } from 'ramda';

import { StringLoadMore } from 'components/StringLoadMore';
import { timeFromTimestamp, shortDateFromTimestamp } from 'utils/formatDate';

import './StatusList.scss';

import t from './i18n';

export type OrderStatusType = {
  date: string,
  committer: string,
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
      <span styleName="headerDate">{t.date}</span>
      <span styleName="headerCommitter">{t.committer}</span>
      <span styleName="headerStatus">{t.status}</span>
      <span styleName="headerAdditionalInfo">{t.additionalInfo}</span>
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
          <div styleName="rowCommitter">{toLower(item.committer)}</div>
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
          <strong>{t.statusHistory}</strong>
        </div>
        {this.renderTitle()}
        {this.renderRows(items)}
      </div>
    );
  }
}

export default StatusList;
