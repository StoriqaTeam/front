// @flow

import React, { PureComponent } from 'react';
import { toLower } from 'ramda';

import { Container, Row, Col } from 'layout';
import type { AddAlertInputType } from 'components/App/AlertContext';

import Menu from './ManageStoreMenu';

import './ManageStoreDecorator.scss';

type PropsType = {
  showAlert: (input: AddAlertInputType) => void,
};

export default (OriginalComponent: any, title: string) =>
  class Manage extends PureComponent<PropsType> {
    render() {
      return (
        <Container>
          <Row>
            <Col size={2}>
              <Menu
                activeItem={toLower(title)}
                showAlert={this.props.showAlert}
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
