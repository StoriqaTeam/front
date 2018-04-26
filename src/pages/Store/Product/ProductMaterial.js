// @flow

import React, { Component } from 'react';

import { Select } from 'components/common/Select';

import './ProductMaterial.scss';

import {
  SelectedType,
} from './types';

type material = {id: string | number, label: string};

type PropsType = {
  // eslint-disable-next-line
  isReset: boolean,
  title: string,
  materials: material[],
  onSelect: Function,
}

type StateType = {
  selected: SelectedType,
}

class ProductMaterial extends Component<PropsType, StateType> {
  /**
   * @static
   * @param {PropsType} nextProps
   * @param {StateType} prevState
   * @return {StateType | null}
   */
  static getDerivedStateFromProps(nextProps: PropsType, prevState: StateType): StateType | null {
    const { isReset } = nextProps;
    if (isReset) {
      return {
        selected: null,
      };
    }
    return prevState;
  }
  state = {
    selected: null,
  };
  /**
   * Highlights size's border when clicked
   * @param {SelectedType} selected
   * @return {void}
   */
  handleSelect = (selected: SelectedType): void => {
    const { onSelect } = this.props;
    this.setState({
      selected,
    }, () => onSelect(selected));
  };
  render() {
    const {
      title,
      materials,
    } = this.props;
    const { selected } = this.state;
    return (
      <div styleName="container">
        <h4>{ title }</h4>
        <Select
          forForm
          activeItem={selected || materials[0]}
          items={materials}
          onSelect={this.handleSelect}
        />
      </div>
    );
  }
}

export default ProductMaterial;
