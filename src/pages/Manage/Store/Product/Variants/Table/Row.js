// @flow

import React, { Component } from 'react';

import { Checkbox } from 'components/Forms';
import { log } from 'utils';

type PropsType = {
  id: string,
  expanded: boolean,
  // vendorCode: string,
  // price: number,
  // cashback: number,
  // characteristics: any,
  // quantity: {},
};

type StateType = {
  checked: boolean,
};

class Row extends Component<PropsType, StateType> {
  state: StateType = {
    //
  };

  handleCheckboxCheck = () => {
    this.setState(prevState => ({ checked: !prevState.checked }));
  };

  handleExpandClick = (id: string) => {
    log.debug(`expand row with id ${id}`);
  };

  render() {
    const {
      id,
      expanded,
    } = this.props;

    const { checked } = this.state;
    return (
      <div>
        <Checkbox
          id={`variants-row-${id}`}
          label=""
          checked={checked}
          onChange={this.handleCheckboxCheck}
          errors={[]}
        />
        <button onClick={() => this.handleExpandClick(id)}>{expanded ? '>' : 'V'}</button>
      </div>
    );
  }
}

export default Row;
