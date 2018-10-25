// @flow

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { isEmpty, pathOr, map } from 'ramda';
import classNames from 'classnames';
import { Environment } from 'relay-runtime';

import { Button } from 'components/common/Button';
import { log, fromRelayError } from 'utils';
import { withShowAlert } from 'components/App/AlertContext';

import { DeactivateProductMutation } from 'relay/mutations';
import type { MutationParamsType } from 'relay/mutations/DeactivateProductMutation';
import type { AddAlertInputType } from 'components/App/AlertContext';

import Table from './Table/Table';
import Header from './Header/Header';
import Row from './Row/Row';

import './Variants.scss';

type AttributeType = {
  id: string,
  rawId: number,
  name: {
    lang: string,
    text: string,
  },
};

type StateType = {
  isNewVariant: boolean,
};

type PropsType = {
  variants: Array<*>,
  productId: string,
  environment: Environment,
  onExpandClick: (id: number) => void,












  productRawId: number,
  productId: string,
  category: {},
  variants: Array<{
    id: string,
    rawId: number,
    vendorCode: string,
    price: number,
    cashback: number,
    discount: number,
    attributes: Array<{
      attribute: {
        name: Array<{ text: string }>,
      },
      value: string,
    }>,
    stocks: Array<{
      id: string,
      productId: number,
      warehouseId: string,
      quantity: number,
      warehouse: {
        name: ?string,
        slug: string,
        addressFull: {
          value: string,
        },
      },
    }>,
  }>,
  storeID: string,
  showAlert: (input: AddAlertInputType) => void,
  comeResponse: boolean,
  resetComeResponse: () => void,
  closedVariantFormAnnunciator: boolean,
  customAttributes: Array<AttributeType>,
};

class Variants extends Component<PropsType, StateType> {
  state = {
    isNewVariant: false,
  };

  // componentDidUpdate(prevProps: PropsType) {
  //   const { closedVariantFormAnnunciator } = this.props;
  //   if (
  //     closedVariantFormAnnunciator !== prevProps.closedVariantFormAnnunciator
  //   ) {
  //     this.toggleNewVariantParam(false);
  //   }
  // }
  //
  handleDeleteVariant = (id: string) => {
    const { environment, productId } = this.props;
    if (!productId || !id) {
      this.props.showAlert({
        type: 'danger',
        text: 'Something going wrong :(',
        link: { text: 'Close.' },
      });
    }
    const params: MutationParamsType = {
      input: {
        clientMutationId: '',
        id,
      },
      parentID: productId,
      environment,
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
        log.debug({ response, errors });

        const relayErrors = fromRelayError({ source: { errors } });
        log.debug({ relayErrors });
        // $FlowIgnoreMe
        const statusError: string = pathOr({}, ['100', 'status'], relayErrors);
        if (!isEmpty(statusError)) {
          this.props.showAlert({
            type: 'danger',
            text: `Error: "${statusError}"`,
            link: { text: 'Close.' },
          });
          return;
        }
        this.props.showAlert({
          type: 'success',
          text: 'Variant deleted!',
          link: { text: '' },
        });
      },
      onError: (error: Error) => {
        log.debug({ error });
        this.props.showAlert({
          type: 'danger',
          text: 'Something going wrong :(',
          link: { text: 'Close.' },
        });
      },
    };
    DeactivateProductMutation.commit(params);
  };

  expandClick = (id: number) => {
    this.props.onExpandClick(id);
  };
  //
  // toggleNewVariantParam = (value: boolean) => {
  //   this.setState({ isNewVariant: value });
  // };

  render() {
    // const {
    //   category,
    //   variants,
    //   productRawId,
    //   productId,
    //   storeID,
    //   comeResponse,
    //   resetComeResponse,
    //   closedVariantFormAnnunciator,
    //   customAttributes,
    // } = this.props;
    // // console.log('---attributes', attributes);
    // const { isNewVariant } = this.state;

    const { variants } = this.props;
    console.log('---variants', variants);
    return (
      <div className="container">
        <Header />
        <div className="rows">
          {map(item => (
            <Row
              key={item.rawId}
              variant={item}
              handleDeleteVariant={this.handleDeleteVariant}
              onExpandClick={this.expandClick}
            />
          ), variants)}
        </div>
        {/* <Fragment>
          <div
            styleName={classNames('container', { newVariant: isEmpty(variants) })}
          >
            {!isEmpty(variants) && (
              <div styleName="header">
                <div styleName="title">
                  <strong>Item variants</strong>
                </div>
                {!isNewVariant && (
                  <div styleName="button">
                    <Button
                      wireframe
                      big
                      onClick={() => {
                        this.toggleNewVariantParam(true);
                      }}
                      dataTest="addVariantButton"
                    >
                      Add variant
                    </Button>
                  </div>
                )}
              </div>
            )}
            <Table
              category={category}
              variants={variants}
              productRawId={productRawId}
              productId={productId}
              storeID={storeID}
              handleDeleteVariant={this.handleDeleteVariant}
              comeResponse={comeResponse}
              resetComeResponse={resetComeResponse}
              isNewVariant={isNewVariant}
              toggleNewVariantParam={this.toggleNewVariantParam}
              closedVariantFormAnnunciator={closedVariantFormAnnunciator}
            />
          </div>
        </Fragment> */}
      </div>
    );
  }
}

export default withShowAlert(Variants);
