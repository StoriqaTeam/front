// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { addIndex, map } from 'ramda';

import { Col } from 'layout';
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
      <header styleName="container">
        <Col size={12} sm={6} md={4} lg={3} xl={3}>
          <Input
            id="searchTermInput"
            label="Search order"
            onChange={this.handleSearchTermChange}
            value={this.state.searchTerm || ''}
            limit={100}
            fullWidth
            search
          />
        </Col>
        <Col size={12} sm={6} md={4} lg={3} xl={3} lgVisible>
          <div styleName="orderSelect">
            <Select
              items={orderStatusesItems}
              activeItem={this.state.orderStatus || undefined}
              dataTest="OrderStatusSelect"
              forForm
              onSelect={this.handleOrderStatusChange}
              containerStyle={{
                marginBottom: '1px',
                marginLeft: '3rem',
                // width: '26.25rem',
              }}
              label="Order status"
              withEmpty
              fullWidth
            />
          </div>
        </Col>
        <Col md={3} lg={3} xl={3} lgVisible>
          <div styleName="birthdateSelect">
            <BirthdateSelect
              label="Order date"
              handleBirthdateSelect={this.handleOrderDateChange}
              birthdate={this.state.orderDate}
            />
          </div>
        </Col>
        <Col size={12} sm={6} md={8} lg={3} xl={3}>
          <div styleName="buttonWrapper">
            <Button wireframe big>
              Open ticket
            </Button>
          </div>
        </Col>
      </header>
    );
  }
}

Header.contextTypes = {
  directories: PropTypes.object.isRequired,
};

export default Header;
