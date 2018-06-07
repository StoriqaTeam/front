// @flow

import React, { PureComponent } from 'react';
import { pathOr, toLower } from 'ramda';

import { Container, Row, Col } from 'layout';
import type { AddAlertInputType } from 'components/App/AlertContext';

import Menu from './Menu';

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
      const baseProduct = pathOr(null, ['me', 'baseProduct'], this.props);
      return (
        <Container>
          <Row>
            <Col size={2}>
              <Menu
                activeItem={toLower(title)}
                showAlert={this.props.showAlert}
                storeData={store || baseProduct.store}
                baseProductData={baseProduct}
              />
            </Col>
            <Col size={10}>
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
      );
    }
  };
