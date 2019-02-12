// @flow strict

import React, { PureComponent } from 'react';
import type { ComponentType } from 'react';
import { pathOr, isNil } from 'ramda';
import classNames from 'classnames';

import { Container, Row, Col } from 'layout';
import { AppContext } from 'components/App';

import { uploadFile } from 'utils';

import Menu from '../ManageStoreMenu';

import './ManageStoreDecorator.scss';

type StateType = {
  newStoreName: ?string,
  newStoreLogo: ?string,
};

export default (props: {
  OriginalComponent: ComponentType<*>,
  active: string,
  title: string,
  isNewStore?: boolean,
}) => {
  const { OriginalComponent, active, title, isNewStore } = props;

  return class Manage extends PureComponent<{}, StateType> {
    state: StateType = {
      newStoreName: null,
      newStoreLogo: null,
    };

    handleOnUpload = async (
      e: SyntheticInputEvent<HTMLInputElement>,
    ): Promise<void> => {
      e.preventDefault();
      const file = e.target.files[0];
      const result = await uploadFile(file);
      if (!isNil(result.url)) return;
      this.setState({ newStoreLogo: result.url });
    };

    deleteAvatar = (): void => {
      this.setState({ newStoreLogo: null });
    };

    handleNewStoreNameChange = (value: string): void => {
      this.setState({ newStoreName: value });
    };

    render() {
      const { newStoreName, newStoreLogo } = this.state;
      let menuProps = {
        activeItem: active,
        title,
      };
      let formProps = { ...this.props };

      if (!isNil(isNewStore)) {
        menuProps = {
          ...menuProps,
          newStoreLogo,
          newStoreName,
          handleOnUpload: this.handleOnUpload,
          deleteAvatar: this.deleteAvatar,
        };
        formProps = {
          ...formProps,
          handleNewStoreNameChange: this.handleNewStoreNameChange,
          newStoreLogo,
          newStoreName,
        };
      }
      return (
        <AppContext.Consumer>
          {({ environment }) => (
            <div styleName="wrapper">
              <Container>
                <Row>
                  <Col md={3} lg={2} xl={2}>
                    <Menu {...menuProps} environment={environment} />
                  </Col>
                  <Col md={9} lg={10} xl={10}>
                    <div styleName="container">
                      <div styleName="header">
                        <span styleName="title">{title}</span>
                      </div>
                      <div
                        styleName={classNames('form', {
                          formOrder: pathOr(
                            false,
                            ['match', 'params', 'orderId'],
                            this.props,
                          ),
                        })}
                      >
                        <OriginalComponent
                          environment={environment}
                          {...formProps}
                        />
                      </div>
                    </div>
                  </Col>
                </Row>
              </Container>
            </div>
          )}
        </AppContext.Consumer>
      );
    }
  };
};
