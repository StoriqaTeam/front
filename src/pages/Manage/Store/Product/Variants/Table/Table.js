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
  variants: Array<{ rawId: number }>,
  productId: number,
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

  expandRow = (id: string) => {
    if (this.state.expandedItemId && this.state.expandedItemId === id) {
      this.setState({ expandedItemId: null });
    } else {
      this.setState({ expandedItemId: id });
    }
  };

  renderRows = () => {
    const { expandedItemId } = this.state;
    return map(item => {
      if (propEq('rawId', expandedItemId, item)) {
        return (
          /* $FlowIgnoreMe */
          <Form
            category={this.props.category}
            variant={item}
            productId={this.props.productId}
            key={item.id}
            isExpanded
            onExpandClick={this.expandRow}
          />
        );
      }
      return (
        <Row key={item.id} variant={item} onExpandClick={this.expandRow} />
      );
    }, this.props.variants);
  };

  render() {
    return (
      <div>
        <Header onSelectAllClick={this.handleSelectAll} />
        {this.renderRows()}
        {!this.state.expandedItemId && (
          /* $FlowIgnoreMe */
          <Form
            category={this.props.category}
            productId={this.props.productId}
          />
        )}
      </div>
    );
  }
}

export default Table;
