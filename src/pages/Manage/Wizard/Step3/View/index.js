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

import ProductLayer from '../ProductLayer';
import FormWrapper from '../../FormWrapper';

import type { BaseProductNodeType } from '../../Wizard';
import ThirdForm from '../ThirdForm';

import './View.scss';

import t from './i18n';

type CategoriesTreeType = {
  rawId: number,
  level: number,
  children: ?Array<CategoriesTreeType>,
};

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
  onUploadPhoto: (type: string, url: string) => void,
  onDelete: (ID: string) => void,
  products: Array<ProductType>,
  onSave: (callback: () => void) => void,
  onClearProductState: () => void,
  formStateData: BaseProductNodeType,
  onChangeEditingProduct: (val: boolean) => void,
  isSavingInProgress: boolean,
  allCategories: CategoriesTreeType,
};

type StateType = {
  showForm: boolean,
  deleteId: ?string,
  priceUsd: ?number,
};

class ThirdStepView extends React.Component<PropsType, StateType> {
  state = {
    showForm: false,
    deleteId: null,
    priceUsd: null,
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
        price: parseFloat(productDataFromItem.price),
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
          <span styleName="buttonLabel">{t.addNewProduct}</span>
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
          <div styleName="text">{t.currentlyYouHaveNoProducts}</div>
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
              <span>{t.addFirstProduct}</span>
            </Button>
          </div>
        </div>
      </div>
    );
  };

  render() {
    const {
      formStateData,
      onChange,
      products,
      onUploadPhoto,
      onSave,
      isSavingInProgress,
      allCategories,
    } = this.props;
    const { showForm, deleteId, priceUsd } = this.state;
    const productsArr = map(item => item.node, products);
    const filteredProductsArr = filter(item => {
      // $FlowIgnoreMe
      const edges = pathOr([], ['products', 'edges'], item);
      return !isEmpty(edges);
    }, productsArr);
    const mapIndexed = addIndex(map);
    if (showForm) {
      return (
        <ThirdForm
          data={formStateData}
          categories={this.context.directories.categories}
          onChange={onChange}
          onUploadPhoto={onUploadPhoto}
          onSave={onSave}
          onClose={this.handleOnCloseModal}
          isSavingInProgress={isSavingInProgress}
          allCategories={allCategories}
        />
      );
    }
    return (
      <FormWrapper
        thirdForm
        title={t.fillYouStoreWithGoods}
        description={t.pleaseAddTheProduct}
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
                        <CardProduct item={item} priceUsd={priceUsd} />
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
          <Modal
            showModal={Boolean(deleteId)}
            onClose={this.handleOnCloseDelete}
          >
            <div styleName="deleteWrapper">
              <div styleName="deleteContent">
                <div styleName="title">{t.deleteYourProduct}</div>
                <div styleName="description">{t.areYouSure}</div>
                <div styleName="buttonsContainer">
                  <Button
                    onClick={this.handleOnCloseDelete}
                    dataTest="wizardDeleteProductCancelButton"
                    wireframe
                    big
                  >
                    <span>{t.cancel}</span>
                  </Button>
                  <div styleName="deleteButton">
                    <Button
                      onClick={this.handleOnDelete(deleteId)}
                      dataTest="wizardDeleteProductButton"
                      big
                      pink
                    >
                      <span>{t.yesDeletePlease}</span>
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
