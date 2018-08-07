// @flow

import React, { Component } from 'react';
import { map, propEq } from 'ramda';

import { log } from 'utils';

import Row from './Row';
import Form from './Form/Form';
import Header from './Header';

import './Table.scss';

type PropsType = {
  category: {},
  variants: Array<{ rawId: number }>,
  productRawId: number,
  productId: string,
  storeID: string,
  handleDeleteVariant: (id: string) => void,
};

type StateType = {
  expandedItemId: ?number,
};

class Table extends Component<PropsType, StateType> {
  state: StateType = {
    expandedItemId: null,
  };

  handleCreateVariant = (variant: {}) => {
    log.debug('handleCreateVariant', { variant });
  };

  handleSelectAll = () => {
    // TODO:
  };

  handleCollapseVariant = () => {
    this.setState({ expandedItemId: null });
  };

  expandRow = (id: number) => {
    if (this.state.expandedItemId && this.state.expandedItemId === id) {
      this.setState({ expandedItemId: null });
    } else {
      this.setState({ expandedItemId: id });
    }
  };

  handleDeleteVariant = (id: string) => {
    this.props.handleDeleteVariant(id);
  };

  renderRows = () => {
    const { expandedItemId } = this.state;
    return map(item => {
      if (propEq('rawId', expandedItemId, item)) {
        return (
          <Form
            category={this.props.category}
            variant={item}
            productRawId={this.props.productRawId}
            productId={this.props.productId}
            key={item.id}
            isExpanded
            onExpandClick={this.expandRow}
            storeID={this.props.storeID}
            handleCollapseVariant={this.handleCollapseVariant}
          />
        );
      }
      return (
        <Row
          key={item.id}
          variant={item}
          onExpandClick={this.expandRow}
          handleDeleteVariant={this.handleDeleteVariant}
        />
      );
    }, this.props.variants);
  };

  render() {
    return (
      <div>
        <div style={{ overflow: 'hidden' }}>
          <div styleName="table">
            <div styleName="tableWrapper">
              <Header onSelectAllClick={this.handleSelectAll} />
              {this.renderRows()}
            </div>
          </div>
        </div>
        {!this.state.expandedItemId && (
          <Form
            category={this.props.category}
            productRawId={this.props.productRawId}
            productId={this.props.productId}
            storeID={this.props.storeID}
          />
        )}
      </div>
    );
  }
}

export default Table;
