// @flow strict

import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { reject, map, prop, addIndex, omit } from 'ramda';

import { Row, Col } from 'layout';
import { Icon } from 'components/Icon';
import { Button } from 'components/common/Button';
import { CardProduct } from 'components/CardProduct';
import { log } from 'utils';

import type { ProductsStep_store as ProductsStepStore } from './__generated__/ProductsStep_store.graphql';

import FormWrapper from '../../FormWrapper';
import WizardFooter from '../../WizardFooter';
import ProductLayer from './ProductLayer';

import './ProductsStep.scss';

type PropsType = {
  store: ?ProductsStepStore,
};

type BaseProductsType = $NonMaybeType<
  $PropertyType<ProductsStepStore, 'baseProducts'>,
>;
type BaseProductsEdgeType = $NonMaybeType<
  $ElementType<$ElementType<BaseProductsType, 'edges'>, number>,
>;
type BaseProductsNodeType = $PropertyType<BaseProductsEdgeType, 'node'>;
export type { BaseProductsNodeType };

const mapIndexed = addIndex(map);

class ProductsStep extends React.PureComponent<PropsType> {
  productsWithVariants = (): Array<BaseProductsNodeType> => {
    const baseProductsEdgesRO =
      (this.props.store &&
        this.props.store.baseProducts &&
        this.props.store.baseProducts.edges) ||
      [];

    const baseProducts: Array<BaseProductsNodeType> = map(
      prop('node'),
      Array(...baseProductsEdgesRO),
    );

    return reject(
      (item: BaseProductsNodeType) =>
        item.products == null || item.products.edges.length === 0,
      baseProducts,
    );
  };

  handleEditItem = (id: ?number) => () => {
    if (id != null) {
      window.location.href = `/manage/wizard/edit/${id}`;
    }
  };

  handleDeleteItem = (id: ?number) => () => {
    if (id != null) {
      log.debug('handleDeleteItem', id);
    }
  };

  renderGreeting = () => (
    <div styleName="firstUploaderItem">
      <div styleName="firstUploaderItemWrapper">
        <div styleName="icon">
          <Icon type="cameraPlus" size={80} inline={false} />
        </div>
        <div styleName="text">
          Currently you have no products in your store. Click ‘Add’ to start
          filling your store with products.
        </div>
        <div styleName="button">
          <Button
            onClick={() => {
              window.location.href = '/manage/wizard/add';
            }}
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

  renderProducts = () => (
    <React.Fragment>
      <Col size={12} md={4} xl={3}>
        <div
          styleName="productItem uploaderItem"
          role="button"
          onClick={() => log.debug('add', {})}
          onKeyDown={() => {}}
          tabIndex={0}
          data-test="wizardUploaderProductFoto"
        >
          <div styleName="productContent">
            <Icon type="cameraPlus" size={56} />
            <span styleName="buttonLabel">Add new product</span>
          </div>
        </div>
      </Col>
      {mapIndexed((item, index) => {
        log.debug('item', item);
        return (
          <Col size={12} md={4} xl={3} key={index}>
            <div styleName="productItem cardItem">
              <div styleName="productContent">
                <CardProduct
                  item={{
                    ...omit(['name', 'products'], item),
                    name: Array(...item.name),
                    products: item.products || { edges: [] },
                  }}
                />
                <ProductLayer
                  onDelete={this.handleDeleteItem(item.rawId)}
                  onEdit={this.handleEditItem(
                    item.products &&
                      item.products.edges[0] &&
                      item.products.edges[0].node.rawId,
                  )}
                />
              </div>
            </div>
          </Col>
        );
      }, this.productsWithVariants())}
    </React.Fragment>
  );

  render() {
    log.debug('ProductsStep props', this.props);
    const { store } = this.props;

    return (
      <React.Fragment>
        <div styleName="contentWrapper">
          <FormWrapper
            thirdForm
            title="Fill your store with goods"
            description="Choose what you gonna sale in your marketplace and add it with ease"
          >
            <div styleName="view">
              <Row>
                {(!store || !store.baseProducts) && <div>No data provided</div>}
                {this.productsWithVariants().length > 0 &&
                  this.renderProducts()}
                {this.productsWithVariants().length === 0 &&
                  this.renderGreeting()}
              </Row>
            </div>
          </FormWrapper>
        </div>
        <div styleName="footerWrapper">
          <WizardFooter
            step={3}
            onClick={() => {}}
            loading={false}
            disabled={false}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default createFragmentContainer(
  ProductsStep,
  graphql`
    fragment ProductsStep_store on Store {
      id
      baseProducts {
        edges {
          node {
            id
            rawId
            currency
            name {
              lang
              text
            }
            storeId
            rating
            products {
              edges {
                node {
                  id
                  rawId
                  discount
                  photoMain
                  cashback
                  price
                }
              }
            }
          }
        }
      }
    }
  `,
);
