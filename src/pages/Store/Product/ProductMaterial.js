// @flow

import React from 'react';

import { MiniSelect } from 'components/MiniSelect';

import './ProductMaterial.scss';

type material = {id: string | number, label: string};

type PropsType = {
  selected: material,
  materials: material[],
  onSelect: Function,
}

const ProductMaterial = (props: PropsType) => (
  <div styleName="container">
    <h4>
      Материал
    </h4>
    <MiniSelect
      forForm
      activeItem={props.selected}
      items={props.materials}
      onSelect={props.onSelect}
    />
  </div>
);

export default ProductMaterial;
