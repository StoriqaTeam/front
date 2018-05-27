// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { omit, pathOr, head, map, addIndex, isEmpty } from 'ramda';

// import { Select } from 'components/common/Select';
// import { AddressForm } from 'components/AddressAutocomplete';
import { Icon } from 'components/Icon';
import { CardProduct } from 'components/CardProduct';
import { Button } from 'components/common/Button';
import { getNameText, log } from 'utils';

import Form from './Form';
import Modal from './Modal';

import './View.scss';

type ProductNodeType = {
  id: string,
  rawId: number,
  storeId: number,
  currencyId: number,
  category: { id: string, rawId: number },
  name: Array<{
    lang: string,
    text: string,
  }>,
  shortDescription: Array<{
    lang: string,
    text: string,
  }>,
  products: {
    edges: Array<{
      discount: number,
      photoMain: string,
      cashback: number,
      price: number,
    }>,
  },
};

type ProductType = {
  node: ProductNodeType,
};

type PropsType = {
  // formStateData: any,
  aditionalPhotosMap: any,
  onChange: (data: { [name: string]: string }) => void,
  onUpload: (type: string, e: any) => Promise<*>,
  onDelete: (ID: string) => void,
  products: Array<ProductType>,
  onSave: () => void,
  onClearProductState: () => void,
  // onChangeAttrs: () => void,
};

type StateType = {
  showForm: boolean,
};

class ThirdStepView extends React.Component<PropsType, StateType> {
  state = {
    showForm: false,
  };

  prepareAttributesValues = (
    attributes: Array<{ value: string, attribute: { rowId: number } }>,
  ) => {
    // debugger;
    log.info('>>> View form 3 prepareAttributesValues: ', { attributes });
    return map(
      item => ({ value: item.value, attrId: item.attribute.rawId }),
      attributes || [],
    );
  };

  handleOnShowForm = (item: ProductNodeType) => {
    const { onChange, formStateData } = this.props;
    // debugger;
    const name = item.name ? getNameText(item.name) : '';
    const shortDescription = item.shortDescription
      ? getNameText(item.shortDescription)
      : '';

    const productsEdges = pathOr(null, ['products', 'edges'], item);
    const productDataFromItem = head(productsEdges)
      ? head(productsEdges).node
      : {};
    log.info('>>> View handleOnShowForm productDataFromItem: ', {
      productDataFromItem,
    });
    const prepareStateObj = {
      ...formStateData,
      product: omit(['attributes'], productDataFromItem),
      attributes: this.prepareAttributesValues(productDataFromItem.attributes),
      categoryId: item.category && item.category.rawId,
      id: item.id,
      name,
      shortDescription,
    };
    log.info('>>> Form 3 View handleOnShowForm item: ', {
      productData: item,
      formStateData,
      prepareStateObj,
    });
    return () => {
      log.info('^^^ handleOnShowForm show form');
      onChange(prepareStateObj);
      this.setState({ showForm: true });
    };
  };

  handleOnCloseModal = () => {
    const { onClearProductState } = this.props;
    this.setState({ showForm: false }, () => {
      onClearProductState();
    });
  };

  handleOnDelete = (ID: string) => () => {
    const { onDelete } = this.props;
    onDelete(ID);
  };

  render() {
    const {
      formStateData,
      aditionalPhotosMap,
      onChange,
      // onChangeAttrs,
      products,
      onUpload,
      onSave,
    } = this.props;
    const { showForm } = this.state;
    const productsArr = map(item => item.node, products);
    // log.info('>>> View Form 3 render: ', {
    //   formStateData,
    //   products,
    //   productsArr,
    // });
    const mapIndexed = addIndex(map);
    return (
      <div styleName="view">
        {!isEmpty(productsArr) ? (
          <div
            styleName="productItem uploaderItem"
            role="button"
            onClick={() => this.setState({ showForm: true })}
            onKeyDown={() => {}}
            tabIndex={0}
            dataTest="wizardUploaderProductFoto"
          >
            <div styleName="productContent">
              <Icon type="cameraPlus" size={56} />
              <span styleName="buttonLabel">Add new product</span>
            </div>
          </div>
        ) : (
          <div styleName="firstUploaderItem">
            <div styleName="firstUploaderItemWrapper">
              <div styleName="icon">
                <Icon type="cameraPlus" size={80} />
              </div>
              <div styleName="text">
                Currently you have no products in your store. Click ‘Add’ to
                start filling your store with products.
              </div>
              <div styleName="button">
                <Button
                  onClick={() => this.setState({ showForm: true })}
                  dataTest="wizardUploaderProductFotoFirst"
                  big
                  wireframe
                >
                  <span>Add first product</span>
                </Button>
              </div>
            </div>
          </div>
        )}
        {!isEmpty(productsArr) &&
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
                      onClick={this.handleOnDelete(item.id)}
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
            // onChangeAttrs={onChangeAttrs}
            onUpload={onUpload}
            onSave={onSave}
            onClose={this.handleOnCloseModal}
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
