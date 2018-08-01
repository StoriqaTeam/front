// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { omit, pathOr, head, map, addIndex, isEmpty, filter } from 'ramda';
import { Col, Row } from 'layout';

import { Icon } from 'components/Icon';
import { CardProduct } from 'components/CardProduct';
import { Button } from 'components/common/Button';
import { getNameText } from 'utils';

import ProductLayer from './ProductLayer';
import FormWrapper from '../FormWrapper';

import type { BaseProductNodeType } from '../Wizard';
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
  onChange: (data: { [name: string]: any }) => void,
  onUpload: (type: string, e: any) => Promise<*>,
  onDelete: (ID: string) => void,
  products: Array<ProductType>,
  onSave: () => void,
  onClearProductState: () => void,
  formStateData: BaseProductNodeType,
};

type StateType = {
  showForm: boolean,
};

class ThirdStepView extends React.Component<PropsType, StateType> {
  state = {
    showForm: false,
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
    const { onChange, formStateData } = this.props;
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
        cashback: productDataFromItem.cashback * 100,
      },
      attributes: this.prepareAttributesValues(productDataFromItem.attributes),
      categoryId: item.category && item.category.rawId,
      id: item.id,
      name,
      shortDescription,
    };
    return () => {
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

  renderUploaderItem = () => (
    <div
      styleName="productItem uploaderItem"
      role="button"
      onClick={() => this.setState({ showForm: true })}
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

  renderFirstUploaderItem = () => (
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
  );

  render() {
    const { formStateData, onChange, products, onUpload, onSave } = this.props;
    const { showForm } = this.state;
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
        description="Choose what you gonna sale in your marketplace and add it with ease"
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
                  <Col size={12} md={4} xl={3}>
                    <div key={index} styleName="productItem cardItem">
                      <div styleName="productContent">
                        <CardProduct item={item} />
                        <ProductLayer
                          onDelete={this.handleOnDelete(item.id)}
                          onEdit={this.handleOnShowForm(item)}
                        />
                      </div>
                    </div>
                  </Col>
                ),
                filteredProductsArr,
              )}
          </Row>
        </div>
      </FormWrapper>
    );
  }
}

ThirdStepView.contextTypes = {
  directories: PropTypes.object.isRequired,
};

export default ThirdStepView;
