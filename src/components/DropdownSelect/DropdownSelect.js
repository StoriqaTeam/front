// @flow

import React, { Component } from 'react';
import classNames from 'classnames';
import { filter, find, insert, not, pipe, propEq } from 'ramda';

import './DropdownSelect.scss';

type ItemsType = Array<{ id: number, label: string }>;

type StateType = {
  isExpanded: boolean,
  checkedDropdownItemId: ?any,
};

type PropsType = {
  items: ItemsType,
  onDropdownSelect?: (id: number) => void,
  namePrefix: string,
};

class DropdownSelect extends Component<PropsType, StateType> {
  state = {
    checkedDropdownItemId: null,
    isExpanded: false,
  };

  handleSelectItem = (id: number) => {
    this.setState(() => ({ checkedDropdownItemId: id }), () => {
      const { onDropdownSelect } = this.props;
      if (onDropdownSelect) {
        onDropdownSelect(id);
      }
      this.handleToggleExpand();
    });
  };

  handleToggleExpand = () => {
    this.setState(prevState => ({ isExpanded: !prevState.isExpanded }));
  };

  withPrefix = (value: string) => `${this.props.namePrefix}_${value}`;

  // move checked item to top
  prepareItems = (items: ItemsType) => {
    const { checkedDropdownItemId } = this.state;

    if (!checkedDropdownItemId) return items;

    const propNotEq = (...args) => pipe(propEq(...args), not);
    const notCheckedItems = filter(propNotEq('id', checkedDropdownItemId), items);
    const checkedItem = find(propEq('id', checkedDropdownItemId), items);
    return insert(0, checkedItem, notCheckedItems);
  };

  renderItem = (item: { id: number, label: string }, idx: number) => {
    const { checkedDropdownItemId } = this.state;
    const checked = checkedDropdownItemId ? checkedDropdownItemId === item.id : idx === 0;
    const inputId = this.withPrefix(`input_${item.id}`);
    return (
      <div
        key={item.id}
        styleName="item"
      >
        <label
          htmlFor={inputId}
          styleName={classNames('itemLabel', { inputChecked: checked })}
        >
          <input
            styleName={classNames('itemInput')}
            type="radio"
            name={inputId}
            id={inputId}
            checked={checked}
            onChange={() => this.handleSelectItem(item.id)}
          />
          {item.label}
        </label>
      </div>
    );
  };

  render() {
    const { items } = this.props;
    const { isExpanded } = this.state;
    return (
      <div styleName={`container ${isExpanded ? 'expanded' : 'collapsed'}`}>
        <button
          styleName="toggleExpand"
          onClick={this.handleToggleExpand}
        />
        {this.prepareItems(items).map(this.renderItem)}
      </div>
    );
  }
}

export default DropdownSelect;
