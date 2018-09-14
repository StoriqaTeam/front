// @flow strict

import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { reject, map, prop } from 'ramda';

import { Col, Row } from 'layout';
import { Icon } from 'components/Icon';
import { Button } from 'components/common/Button';
import { log } from 'utils';

import type { ProductsStep_store as ProductsStepStore } from './__generated__/ProductsStep_store.graphql';
import type { WizardProductsStep_baseProduct as BaseProductType } from './__generated__/WizardProductsStep_baseProduct.graphql';

import ProductCell from './WizardProductsStep';
import FormWrapper from '../../FormWrapper';
import WizardFooter from '../../WizardFooter';

import './ProductsStep.scss';

type PropsType = {
  store: ?ProductsStepStore,
};

class ProductsStep extends React.PureComponent<PropsType> {
  productsWithVariants = (): Array<BaseProductType> => {
    const baseProductsEdgesRO =
      (this.props.store &&
        this.props.store.baseProducts &&
        this.props.store.baseProducts.edges) ||
      [];

    const baseProductsEdges: Array<BaseProductType> = map(
      prop('node'),
      Array(...baseProductsEdgesRO),
    );

    return reject(
      (item: BaseProductType) =>
        item.products == null || item.products.edges.length === 0,
      baseProductsEdges,
    );
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
      {map(
        item => <ProductCell product={item} key={item.id} />,
        this.productsWithVariants(),
      )}
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
            ...WizardProductsStep_baseProduct
          }
        }
      }
    }
  `,
);
