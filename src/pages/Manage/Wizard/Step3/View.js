// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { map, addIndex } from 'ramda';

// import { Select } from 'components/common/Select';
// import { AddressForm } from 'components/AddressAutocomplete';
import { Icon } from 'components/Icon';
import { CardProduct } from 'components/CardProduct';
import { getNameText, log } from 'utils';

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
  formStateData: any,
  aditionalPhotosMap: any,
  onChange: (data: { [name: string]: string }) => void,
  onUpload: (type: string, e: any) => void,
  products: Array<ProductType>,
};

type StateType = {
  showForm: boolean,
};

class ThirdStepView extends React.Component<PropsType, StateType> {
  state = {
    showForm: false,
  };

  handleOnShowForm = item => {
    const { onChange, formStateData } = this.props;
    const name = item.name ? getNameText(item.name) : '';
    const shortDescription = item.shortDescription
      ? getNameText(item.shortDescription)
      : '';
    const prepareStateObj = {
      ...formStateData,
      categoryId: item.category && item.category.rawId,
      id: item.id,
      name,
      shortDescription,
    };
    log.info('>>> Form 3 View handleOnShowForm item: ', {
      productData: item,
      stateData: formStateData,
      prepareStateObj,
    });
    return () => {
      log.info('^^^ handleOnShowForm show form');
      onChange(prepareStateObj);
      this.setState({ showForm: true });
    };
  };

  handleOnCloseModal = () => {
    this.setState({ showForm: false });
  };

  render() {
    const {
      formStateData,
      aditionalPhotosMap,
      onChange,
      onChangeAttrs,
      products,
      onUpload,
      onSave,
    } = this.props;
    const { showForm } = this.state;
    const productsArr = map(item => item.node, products);
    log.info('>>> View Form 3 render: ', {
      formStateData,
      products,
      productsArr,
    });
    const mapIndexed = addIndex(map);
    return (
      <div styleName="view">
        <div
          styleName="productItem uploaderItem"
          role="button"
          onClick={() => this.setState({ showForm: true })}
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
                      onClick={this.handleOnShowForm(item)}
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
            data={formStateData}
            categories={this.context.directories.categories}
            aditionalPhotosMap={aditionalPhotosMap}
            onChange={onChange}
            onChangeAttrs={onChangeAttrs}
            onUpload={onUpload}
            onSave={onSave}
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
