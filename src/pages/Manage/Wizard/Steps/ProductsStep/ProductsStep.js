// @flow strict

import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';

import { Col, Row } from 'layout';
import { Icon } from 'components/Icon';
import { Button } from 'components/common/Button';
import { log } from 'utils';

import type { ProductsStep_store as ProductsStepStore } from './__generated__/ProductsStep_store.graphql';

import FormWrapper from '../../FormWrapper';
import WizardFooter from '../../WizardFooter';

import './ProductsStep.scss';

type PropsType = {
  store: ?ProductsStepStore,
};

class ProductsStep extends React.PureComponent<PropsType> {
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
            onClick={() => {}}
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

  renderProducts = () => <div>products here</div>;

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
                {store &&
                  store.baseProducts &&
                  store.baseProducts.edges.length > 0 &&
                  this.renderProducts()}
                {store &&
                  store.baseProducts &&
                  store.baseProducts.edges.length === 0 &&
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
          }
        }
      }
    }
  `,
);
