// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { omit, pathOr, head, map, addIndex, isEmpty, filter } from 'ramda';
import { Col, Row } from 'layout';

import { Icon } from 'components/Icon';
import { CardProduct } from 'components/CardProduct';
import { Button } from 'components/common/Button';
import { getNameText } from 'utils';
import { Modal } from 'components/Modal';

import ProductLayer from './ProductLayer';
import FormWrapper from '../FormWrapper';

import type { BaseProductNodeType } from '../Wizard';
import Form from './Form';

import './View.scss';

type ProductNodeType = {
  id: string,
  rawId: number,
  storeId: number,
  currency: string,
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
  onChange: (data: { [name: string]: any }) => void,
  onUpload: (type: string, e: any) => Promise<*>,
  onDelete: (ID: string) => void,
  products: Array<ProductType>,
  onSave: (callback: () => void) => void,
  onClearProductState: () => void,
  formStateData: BaseProductNodeType,
  onChangeEditingProduct: (val: boolean) => void,
};

type StateType = {
  showForm: boolean,
  deleteId: ?string,
};

class ThirdStepView extends React.Component<PropsType, StateType> {
  state = {
    showForm: false,
    deleteId: null,
  };

  prepareAttributesValues = (
    attributes: Array<{
      value: string,
      attribute: { rawId: number },
      metaField: ?string,
    }>,
  ) =>
    map(
      item => ({
        value: item.value,
        attrId: item.attribute.rawId,
        metaField: item.metaField,
      }),
      attributes || [],
    );

  handleOnShowForm = (item: ProductNodeType) => {
    const { onChange, formStateData, onChangeEditingProduct } = this.props;
    const name = item.name ? getNameText(item.name, 'EN') : '';
    const shortDescription = item.shortDescription
      ? getNameText(item.shortDescription, 'EN')
      : '';
    // $FlowIgnoreMe
    const productsEdges = pathOr(null, ['products', 'edges'], item);
    const productDataFromItem = head(productsEdges)
      ? head(productsEdges).node
      : {};
    const prepareStateObj = {
      ...formStateData,
      product: {
        ...omit(['attributes'], productDataFromItem),
        cashback: Math.round((productDataFromItem.cashback || 0) * 100),
        price: parseInt(productDataFromItem.price, 10),
      },
      attributes: this.prepareAttributesValues(productDataFromItem.attributes),
      categoryId: item.category && item.category.rawId,
      id: item.id,
      name,
      shortDescription,
    };
    return () => {
      onChange(prepareStateObj);
      this.setState({ showForm: true }, () => onChangeEditingProduct(true));
    };
  };

  handleOnCloseModal = () => {
    const { onClearProductState, onChangeEditingProduct } = this.props;
    this.setState({ showForm: false }, () => {
      onClearProductState();
      onChangeEditingProduct(false);
    });
  };

  handleOnDelete = (ID: ?string) => () => {
    const { onDelete } = this.props;
    if (ID) {
      onDelete(ID);
      this.handleOnCloseDelete();
    }
  };

  handleOnCloseDelete = () => {
    this.setState({ deleteId: null });
  };

  handleOnShowDelete = (ID: string) => () => {
    this.setState({ deleteId: ID });
  };

  renderUploaderItem = () => {
    const { onChangeEditingProduct } = this.props;
    return (
      <div
        styleName="productItem uploaderItem"
        role="button"
        onClick={() =>
          this.setState({ showForm: true }, () => onChangeEditingProduct(true))
        }
        onKeyDown={() => {}}
        tabIndex={0}
        data-test="wizardUploaderProductFoto"
      >
        <div styleName="productContent">
          <Icon type="cameraPlus" size={56} />
          <span styleName="buttonLabel">Add new product</span>
        </div>
      </div>
    );
  };

  renderFirstUploaderItem = () => {
    const { onChangeEditingProduct } = this.props;
    return (
      <div styleName="firstUploaderItem">
        <div styleName="firstUploaderItemWrapper">
          <div styleName="icon">
            <Icon type="cameraPlus" size={80} />
          </div>
          <div styleName="text">
            Currently you have no products in your store. Click ‘Add’ to start
            filling your store with products.
          </div>
          <div styleName="button">
            <Button
              onClick={() =>
                this.setState({ showForm: true }, () =>
                  onChangeEditingProduct(true),
                )
              }
              dataTest="wizardUploaderProductFotoFirst"
              big
              wireframe
            >
              <span>Add first product</span>
            </Button>
          </div>
        </div>
      </div>
    );
  };

  render() {
    const { formStateData, onChange, products, onUpload, onSave } = this.props;
    const { showForm, deleteId } = this.state;
    const productsArr = map(item => item.node, products);
    const filteredProductsArr = filter(item => {
      // $FlowIgnoreMe
      const edges = pathOr([], ['products', 'edges'], item);
      return !isEmpty(edges);
    }, productsArr);
    const mapIndexed = addIndex(map);
    if (showForm) {
      return (
        <Form
          data={formStateData}
          categories={this.context.directories.categories}
          onChange={onChange}
          onUpload={onUpload}
          onSave={onSave}
          onClose={this.handleOnCloseModal}
        />
      );
    }
    return (
      <FormWrapper
        thirdForm
        title="Fill your store with goods"
        description="Please add the product you would like to sell in your marketplace"
      >
        <div styleName="view">
          <Row>
            {!isEmpty(filteredProductsArr) ? (
              <Col size={12} md={4} xl={3}>
                {this.renderUploaderItem()}
              </Col>
            ) : (
              this.renderFirstUploaderItem()
            )}
            {!isEmpty(filteredProductsArr) &&
              mapIndexed(
                (item, index) => (
                  <Col size={12} md={4} xl={3} key={index}>
                    <div styleName="productItem cardItem">
                      <div styleName="productContent">
                        <CardProduct item={item} />
                        <ProductLayer
                          onDelete={this.handleOnShowDelete(item.id)}
                          onEdit={this.handleOnShowForm(item)}
                        />
                      </div>
                    </div>
                  </Col>
                ),
                filteredProductsArr,
              )}
          </Row>
          <Modal showModal={deleteId} onClose={this.handleOnCloseDelete}>
            <div styleName="deleteWrapper">
              <div styleName="deleteContent">
                <div styleName="title">Delete your product?</div>
                <div styleName="description">
                  Are you sure you want to delete this listing? All the listing
                  information will be discarded and cannot be retrieved.
                </div>
                <div styleName="buttonsContainer">
                  <Button
                    onClick={this.handleOnCloseDelete}
                    dataTest="wizardDeleteProductCancelButton"
                    wireframe
                    big
                  >
                    <span>Cancel</span>
                  </Button>
                  <div styleName="deleteButton">
                    <Button
                      onClick={this.handleOnDelete(deleteId)}
                      dataTest="wizardDeleteProductButton"
                      big
                      pink
                    >
                      <span>Yes, delete, please</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Modal>
        </div>
      </FormWrapper>
    );
  }
}

ThirdStepView.contextTypes = {
  directories: PropTypes.object.isRequired,
};

export default ThirdStepView;
