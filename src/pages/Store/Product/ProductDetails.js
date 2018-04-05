// @flow

import React, { PureComponent } from 'react';

import { ProductPrice, ProductSize, ProductMaterial } from 'pages/Store/Product';

import './ProductDetails.scss';

type material = {id: string | number, label: string}

type stateTypes = {
  sizes: string | number[],
  selected: material,
  materials: material[],
}

class ProductDetails extends PureComponent<{}, stateTypes> {
  state = {
    sizes: [2, 34, 56, 12, 45],
    selected: null,
    materials: [
      { id: '1', label: 'BTC' },
      { id: '2', label: 'ETH' },
      { id: '3', label: 'STQ' },
      { id: '4', label: 'ADA' },
      { id: '5', label: 'NEM' },
      { id: '6', label: 'STRAT' },
    ],
  };
  /**
   * @param {material} selected
   * @return {void}
   */
  handleSelected = (selected: material): void => {
    this.setState({ selected });
  };
  render() {
    const { sizes, materials, selected } = this.state;
    return (
      <div styleName="container">
        <h2 styleName="title">Nike Air Jordan</h2>
        <ProductPrice />
        <p styleName="description">
          {/* eslint-disable max-len */}
          Наушники Bluetooth Beats Beats Solo3 Wireless On-Ear Violet (MNEQ2ZE/A) Объемное звучание на всех частотах, отлично подходит для прослушивания музыки, фильмов.
        </p>
        <ProductSize sizes={sizes} />
        <ProductMaterial
          selected={selected || materials[0]}
          materials={materials}
          onSelect={this.handleSelected}
        />
      </div>
    );
  }
}

export default ProductDetails;
