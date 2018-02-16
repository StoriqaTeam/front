// @flow

import React, { PureComponent } from 'react';

type PropsType = {
  id: string,
  label: string,
  items: Array<{ id: string, value: string }>,
  checked?: string,
  onChange: Function,
};

class RadioGroup extends PureComponent<PropsType> {
  handleCheck = (e: any) => {
    this.props.onChange(e.target.value);
  };

  renderItem = (item: { id: string, value: string }) => (
    <label htmlFor={`${this.props.id}_${item.id}`} key={item.id}>
      <input
        type="radio"
        id={`${this.props.id}_${item.id}`}
        name={this.props.id}
        onChange={this.handleCheck}
        value={`${item.id}`}
        checked={this.props.checked === item.id}
      />
      {item.value}
    </label>
  );

  render() {
    const { items, label } = this.props;
    return (
      <div>
        {label}<br />
        {items.map(this.renderItem)}
      </div>
    );
  }
}

export default RadioGroup;
