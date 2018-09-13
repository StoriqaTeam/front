// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { addIndex, map } from 'ramda';

import { Input } from 'components/common/Input';
import { Select } from 'components/common/Select';
import { Icon } from 'components/Icon';
import { BirthdateSelect } from 'components/common/BirthdateSelect';

import {
  getStatusStringFromEnum,
  getEnumFromStatusString,
} from '../OrderPage/utils';

import './Header.scss';

type PropsType = {
  onSearchTermFilterChanged: string => void,
  onOrderStatusFilterChanged: (?string) => void,
  onOrderFromDateFilterChanged: string => void,
  onOrderToDateFilterChanged: string => void,
};

type StateType = {
  searchTerm: ?string,
  orderStatus: ?{ id: string, label: string },
  orderFromDate: ?string,
  orderToDate: ?string,
};

class Header extends Component<PropsType, StateType> {
  state: StateType = {
    searchTerm: null,
    orderStatus: null,
    orderFromDate: null,
    orderToDate: null,
  };

  handleSearchTermChange = (e: Event) => {
    e.persist();
    this.setState({ searchTerm: e.target.value }, () =>
      this.props.onSearchTermFilterChanged(e.target.value),
    );
  };

  handleOrderStatusChange = (item: { id: string, label: string }) => {
    if (!item) {
      this.setState({ orderStatus: null }, () => {
        this.props.onOrderStatusFilterChanged(null);
      });
      return;
    }

    if (getEnumFromStatusString(item.label)) {
      this.setState({ orderStatus: item }, () =>
        this.props.onOrderStatusFilterChanged(
          getEnumFromStatusString(item.label),
        ),
      );
    }
  };

  handleOrderFromDateChange = (value: string) => {
    this.setState({ orderFromDate: value }, () =>
      this.props.onOrderFromDateFilterChanged(value),
    );
  };

  handleOrderToDateChange = (value: string) => {
    this.setState({ orderToDate: value }, () =>
      this.props.onOrderToDateFilterChanged(value),
    );
  };

  render() {
    const indexedMap = addIndex(map);
    const orderStatusesItems = indexedMap(
      (label, id) => ({
        id: `order_status_${id}`,
        label: getStatusStringFromEnum(label),
      }),
      this.context.directories.orderStatuses,
    );

    return (
      <header styleName="container">
        <div styleName="searchInput">
          <Input
            id="searchTermInput"
            label="Search order"
            onChange={this.handleSearchTermChange}
            value={this.state.searchTerm || ''}
            fullWidth
            search
          />
        </div>
        <div styleName="orderSelect">
          <div styleName="icon">
            <Icon type="status" size={32} />
          </div>
          <Select
            items={orderStatusesItems}
            activeItem={this.state.orderStatus || undefined}
            dataTest="OrderStatusSelect"
            forForm
            onSelect={this.handleOrderStatusChange}
            label="Order status"
            withEmpty
            fullWidth
          />
        </div>
        <div styleName="dateRange">
          <div styleName="icon">
            <Icon type="calendar" size={32} />
          </div>
          <div styleName="calendars">
            <div styleName="item">
              <BirthdateSelect
                brief
                label="From"
                handleBirthdateSelect={this.handleOrderFromDateChange}
                birthdate={this.state.orderFromDate}
              />
            </div>
            <div styleName="item">
              <BirthdateSelect
                brief
                label="To"
                handleBirthdateSelect={this.handleOrderToDateChange}
                birthdate={this.state.orderToDate}
              />
            </div>
          </div>
        </div>
      </header>
    );
  }
}

Header.contextTypes = {
  directories: PropTypes.object.isRequired,
};

export default Header;
