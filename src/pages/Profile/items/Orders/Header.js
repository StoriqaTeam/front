// @flow

import React, { Component } from 'react';

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

  handleOrderStatusChange = (item: { id: string, label: string }) => {
    console.log({ item });
  };

  handleOrderDateChange = (item: { id: string, label: string }) => {
    console.log({ item });
  };

  render() {
    const { searchTerm } = this.state;
    return (
      <div styleName="container">
        <div styleName="inputsWrapper">
          <div styleName="searchTermInputWrapper">
            <Input
              id="searchTermInput"
              label="Search order"
              onChange={this.handleSearchTermChange}
              value={searchTerm || ''}
              limit={100}
              icon="magnifier"
              fullWidth
            />
          </div>
          <Select
            items={[{ id: 'title', label: 'Order status' }]}
            activeItem={{ id: 'title', label: 'Order status' }}
            dataTest="OrderStatusSelect"
            forForm
            onSelect={this.handleOrderStatusChange}
            containerStyle={{
              width: '26.25rem',
              marginLeft: '3rem',
              marginBottom: '1px',
            }}
          />
          <Select
            items={[{ id: 'title', label: 'Order date' }]}
            activeItem={{ id: 'title', label: 'Order date' }}
            dataTest="OrderDateSelect"
            forForm
            onSelect={this.handleOrderDateChange}
            containerStyle={{ width: '26.25rem', marginLeft: '3rem' }}
          />
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

export default Header;
