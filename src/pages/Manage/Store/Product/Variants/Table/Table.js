// @flow

import React, { Component } from 'react';
import { map, propEq } from 'ramda';

import { log } from 'utils';

import Row from './Row';
import Form from './Form/Form';
import Header from './Header';

type PropsType = {
  onSave: Function,
  category: {},
  variants: Array<{}>,
};

type StateType = {
  expandedItemId: ?string,
};

class Table extends Component<PropsType, StateType> {
  state: StateType = {
    expandedItemId: null,
  };

  handleSave = (variant: {}) => {
    this.props.onSave(variant);
  };

  handleCreateVariant = (variant: {}) => {
    log.debug('handleCreateVariant', { variant });
  };

  handleSelectAll = () => {
    // TODO:
  };

  renderRows = () => {
    const { expandedItemId } = this.state;
    map((item) => {
      if (propEq('rawId', expandedItemId)) {
        return (
          <Form
            onSave={this.handleSave}
            category={this.props.category}
            variant={item}
          />
        );
      }
      return (<Row variant={item} />);
    }, this.props.variants);
  };

  render() {
    return (
      <div>
        <Header onSelectAllClick={this.handleSelectAll} />
        {this.renderRows()}
        {!this.state.expandedItemId && (
          <Form
            onSave={this.handleCreateVariant}
            category={this.props.category}
          />
        )}
      </div>
    );
  }
}

export default Table;
