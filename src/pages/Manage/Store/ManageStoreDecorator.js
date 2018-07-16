// @flow

import React, { PureComponent } from 'react';
import { pathOr, toLower } from 'ramda';

import { Container, Row, Col } from 'layout';
import type { AddAlertInputType } from 'components/App/AlertContext';
import { AppContext } from 'components/App';

import Menu from './ManageStoreMenu';

import './ManageStoreDecorator.scss';

type StoreType = {
  name: Array<{
    text: string,
    lang: string,
  }>,
  logo: ?string,
};

type PropsType = {
  showAlert: (input: AddAlertInputType) => void,
  me: {
    store?: StoreType,
    baseProduct?: {
      store?: StoreType,
    },
  },
};

export default (OriginalComponent: any, title: string) =>
  class Manage extends PureComponent<PropsType> {
    render() {
      // $FlowIgnoreMe
      const store = pathOr(null, ['me', 'store'], this.props);
      // $FlowIgnoreMe
      const myStore = pathOr(null, ['me', 'myStore'], this.props);
      // $FlowIgnoreMe
      const baseProduct = pathOr(null, ['me', 'baseProduct'], this.props);
      return (
        <AppContext.Consumer>
          {({ environment }) => (
            <Container>
              <Row>
                <Col sm={3} md={3} lg={2} xl={2}>
                  <Menu
                    environment={environment}
                    activeItem={toLower(title)}
                    showAlert={this.props.showAlert}
                    storeData={
                      store || myStore || (baseProduct && baseProduct.store) || null
                    }
                    baseProductData={baseProduct}
                  />
                </Col>
                <Col sm={9} md={9} lg={10} xl={10}>
                  <div styleName="container">
                    <div styleName="header">
                      <span styleName="title">{title}</span>
                    </div>
                    <div styleName="form">
                      <OriginalComponent {...this.props} />
                    </div>
                  </div>
                </Col>
              </Row>
            </Container>
          )}
        </AppContext.Consumer>
      );
    }
  };
