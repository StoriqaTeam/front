// @flow

import React from 'react';

import { MiniSelect } from 'components/MiniSelect';

import './ProductMaterial.scss';

type material = {id: string | number, label: string};

type propTypes = {
  selected: material,
  materials: material[],
}

const ProductMaterial = (props: propTypes) => (
  <div styleName="container">
    <h4 styleName="title">
      Материал
    </h4>
    <MiniSelect
      forForm
      activeItem={props.selected}
      items={props.materials}
    />
  </div>
);

export default ProductMaterial;
