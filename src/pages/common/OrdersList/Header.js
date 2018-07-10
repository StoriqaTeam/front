// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { addIndex, map } from 'ramda';

import { Input } from 'components/common/Input';
import { Select } from 'components/common/Select';
import { Button } from 'components/common/Button';
import { BirthdateSelect } from 'components/common/BirthdateSelect';

import {
  getStatusStringFromEnum,
  getEnumFromStatusString,
} from '../OrderPage/utils';

import './Header.scss';

type PropsType = {
  onSearchTermFilterChanged: string => void,
  onOrderStatusFilterChanged: (?string) => void,
  onOrderDateFilterChanged: string => void,
};

type StateType = {
  searchTerm: ?string,
  orderStatus: ?{ id: string, label: string },
  orderDate: ?string,
};

class Header extends Component<PropsType, StateType> {
  state: StateType = {
    searchTerm: null,
    orderStatus: null,
    orderDate: null,
  };

  handleSearchTermChange = (e: {
    target: { value: any },
    persist: () => void,
  }) => {
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

  // eslint-disable-next-line
  handleOrderDateChange = (value: string) => {
    this.setState({ orderDate: value }, () =>
      this.props.onOrderDateFilterChanged(value),
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
      <div styleName="container">
        <div styleName="inputsWrapper">
          <div styleName="searchTermInputWrapper">
            <Input
              id="searchTermInput"
              label="Search order"
              onChange={this.handleSearchTermChange}
              value={this.state.searchTerm || ''}
              limit={100}
              icon="magnifier"
              fullWidth
            />
          </div>
          <Select
            items={orderStatusesItems}
            activeItem={this.state.orderStatus || undefined}
            dataTest="OrderStatusSelect"
            forForm
            onSelect={this.handleOrderStatusChange}
            containerStyle={{
              width: '26.25rem',
              marginLeft: '3rem',
              marginBottom: '1px',
            }}
            label="Order status"
            withEmpty
          />
          <div styleName="birthdateSelect">
            <BirthdateSelect
              label="Order date"
              handleBirthdateSelect={this.handleOrderDateChange}
              birthdate={this.state.orderDate}
            />
          </div>
        </div>
        <div styleName="buttonWrapper">
          <Button wireframe big>
            Open ticket
          </Button>
        </div>
      </div>
    );
  }
}

Header.contextTypes = {
  directories: PropTypes.object.isRequired,
};

export default Header;
