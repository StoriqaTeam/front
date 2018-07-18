// @flow

import React, { PureComponent } from 'react';
import { toLower } from 'ramda';

import { Container, Row, Col } from 'layout';
import type { AddAlertInputType } from 'components/App/AlertContext';
import { AppContext } from 'components/App';

import Menu from './ManageStoreMenu';

import './ManageStoreDecorator.scss';

type PropsType = {
  showAlert: (input: AddAlertInputType) => void,
};

export default (OriginalComponent: any, title: string) =>
  class Manage extends PureComponent<PropsType> {
    render() {
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
