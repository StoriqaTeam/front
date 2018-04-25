// @flow

import React, { Component } from 'react';

import { MiniSelect } from 'components/MiniSelect';

import './ProductMaterial.scss';

type material = {id: string | number, label: string};

type PropsType = {
  // eslint-disable-next-line
  isReset: boolean,
  title: string,
  materials: material[],
  onSelect: Function,
}

type StateType = {
  selected: null | Object,
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
   * @param {{}} selected
   * @return {void}
   */
  handleSelect = (selected): void => {
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
        <MiniSelect
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
