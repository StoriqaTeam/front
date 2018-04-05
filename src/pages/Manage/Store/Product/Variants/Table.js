// @flow

import React, { Component } from 'react';

import { log } from 'utils';

// import TableRow from './TableRow';
import Form from './Form';

type PropsType = {
  onSave: Function,
  categoryId: number,
};

type StateType = {
  //
};

class Table extends Component<PropsType, StateType> {
  state: StateType = {
    //
  };

  handleSave = (variant: {}) => {
    this.props.onSave(variant);
  };

  render() {
    return (
      <Form
        onSave={this.handleSave}
        categoryId={this.props.categoryId}
      />
    );
  }
}

export default Table;
