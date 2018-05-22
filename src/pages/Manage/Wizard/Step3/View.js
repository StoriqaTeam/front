// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { map, addIndex, assocPath, path, append } from 'ramda';

// import { Select } from 'components/common/Select';
// import { AddressForm } from 'components/AddressAutocomplete';
import { Icon } from 'components/Icon';
import { CardProduct } from 'components/CardProduct';

import Form from './Form';
import Modal from './Modal';

import './View.scss';

type ProductType = {
  item: {
    rawId: number,
    storeId: number,
    currencyId: number,
    name: Array<{
      lang: string,
      text: string,
    }>,
    variants: Array<{
      discount: number,
      photoMain: string,
      cashback: number,
      price: number,
    }>,
  },
};

type PropsType = {
  data: any,
  aditionalPhotosMap: any,
  onChange: (data: { [name: string]: string }) => void,
  products: Array<ProductType>,
};

type StateType = {
  showForm: boolean,
};

class ThirdStepView extends React.Component<PropsType, StateType> {
  state = {
    showForm: false,
  };

  handleOnAddProduct = () => {
    // console.log('handleOnAddProduct');
    this.setState({ showForm: true });
  };

  handleOnCloseModal = () => {
    this.setState({ showForm: false });
  };

  render() {
    const {
      data,
      aditionalPhotosMap,
      onChange,
      products,
      onUpload,
    } = this.props;
    const { showForm } = this.state;
    const productsArr = map(item => item.node, products.edges);
    console.log('>>> View Form 3 render: ', { data });
    const mapIndexed = addIndex(map);
    return (
      <div styleName="view">
        <div
          styleName="productItem uploaderItem"
          role="button"
          onClick={this.handleOnAddProduct}
          onKeyDown={() => {}}
          tabIndex={0}
        >
          <div styleName="productContent">
            <Icon type="cameraPlus" size={56} />
            <span styleName="buttonLabel">Add new product</span>
          </div>
        </div>
        {productsArr &&
          mapIndexed(
            (item, index) => (
              <div key={index} styleName="productItem cardItem">
                <div styleName="productContent">
                  <CardProduct item={item} />
                  <div styleName="layer">
                    <div
                      styleName="editbutton"
                      onClick={() => {}}
                      role="button"
                      onKeyDown={() => {}}
                      tabIndex={0}
                    >
                      <Icon type="note" size={56} />
                      <span styleName="buttonLabel">Edit product</span>
                    </div>
                    <div
                      styleName="editbutton"
                      onClick={() => {}}
                      role="button"
                      onKeyDown={() => {}}
                      tabIndex={0}
                    >
                      <Icon type="basket" size={56} />
                      <span styleName="buttonLabel">Delete product</span>
                    </div>
                  </div>
                </div>
              </div>
            ),
            productsArr,
          )}
        <Modal showModal={showForm} onClose={this.handleOnCloseModal}>
          <Form
            data={data}
            aditionalPhotosMap={aditionalPhotosMap}
            onChange={onChange}
            onUpload={onUpload}
            categories={this.context.directories.categories}
          />
        </Modal>
      </div>
    );
  }
}

ThirdStepView.contextTypes = {
  directories: PropTypes.object.isRequired,
};

export default ThirdStepView;
