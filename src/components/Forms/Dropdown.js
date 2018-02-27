// @flow

import React, { PureComponent } from 'react';

import { MiniSelect } from 'components/MiniSelect';

import './Dropdown.scss';

type PropsType = {
  label: string,
  items: Array<{ id: number, label: string }>,
  onSelect: (id: number) => void,
};

class Dropdown extends PureComponent<PropsType> {
  render() {
    const { label, items, onSelect } = this.props;
    return (
      <div styleName="container">
        <span styleName="label">{label}</span>
        <MiniSelect
          items={items}
          onSelect={onSelect}
          withTwoArrows
          forForm
        />
      </div>
    );
  }
}

export default Dropdown;
