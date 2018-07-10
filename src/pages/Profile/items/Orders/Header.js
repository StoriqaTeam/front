// @flow

import React, { Component } from 'react';

import { Col } from 'layout';
import { Input } from 'components/common/Input';
import { Select } from 'components/common/Select';
import { Button } from 'components/common/Button';

import './Header.scss';

type PropsType = {
  //
};

type StateType = {
  searchTerm: ?string,
};

class Header extends Component<PropsType, StateType> {
  state: StateType = {
    searchTerm: null,
  };

  handleSearchTermChange = (e: { target: { value: any } }) => {
    this.setState({ searchTerm: e.target.value });
  };

  // eslint-disable-next-line
  handleOrderStatusChange = (item: { id: string, label: string }) => {};

  // eslint-disable-next-line
  handleOrderDateChange = (item: { id: string, label: string }) => {};

  render() {
    const { searchTerm } = this.state;
    return (
      <div styleName="container">
        <Col size={12} sm={6} md={4} lg={3} xl={3}>
          <Input
            id="searchTermInput"
            label="Search order"
            onChange={this.handleSearchTermChange}
            value={searchTerm || ''}
            limit={100}
            icon="magnifier"
            fullWidth
          />
        </Col>
        <Col md={3} lg={3} xl={3} lgVisible>
          <Select
            items={[{ id: 'title', label: 'Order status' }]}
            activeItem={{ id: 'title', label: 'Order status' }}
            dataTest="OrderStatusSelect"
            forForm
            onSelect={this.handleOrderStatusChange}
            containerStyle={{
              marginBottom: '1px',
              marginLeft: '3rem',
              // width: '26.25rem',
            }}
          />
        </Col>
        <Col md={3} lg={3} xl={3} lgVisible>
          <Select
            items={[{ id: 'title', label: 'Order date' }]}
            activeItem={{ id: 'title', label: 'Order date' }}
            dataTest="OrderDateSelect"
            forForm
            onSelect={this.handleOrderDateChange}
            containerStyle={{ marginLeft: '3rem' }}
          />
        </Col>
        <Col size={12} sm={6} md={8} lg={3} xl={3}>
          <div styleName="buttonWrapper">
            <Button wireframe big>
              Open ticket
            </Button>
          </div>
        </Col>
      </div>
    );
  }
}

export default Header;
