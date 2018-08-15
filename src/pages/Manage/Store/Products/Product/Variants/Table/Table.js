// @flow

import React, { Component, Fragment } from 'react';
import { isEmpty, map, propEq, length } from 'ramda';
import classNames from 'classnames';

import { log } from 'utils';

import { ProductFormContext } from 'pages/Manage/Store/Products/Product';

import Row from './Row';
import Form from './Form/Form';
import Header from './Header';

import './Table.scss';

type PropsType = {
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
  productRawId: number,
  productId: string,
  storeID: string,
  handleDeleteVariant: (id: string) => void,
  comeResponse: boolean,
  resetComeResponse: () => void,
  isNewVariant: boolean,
  toggleNewVariantParam: (value: boolean) => void,
};

type StateType = {
  expandedItemId: ?number,
};

class Table extends Component<PropsType, StateType> {
  state: StateType = {
    expandedItemId: null,
  };

  componentDidUpdate(prevProps: PropsType) {
    const { comeResponse, isNewVariant } = this.props;
    if (comeResponse && comeResponse !== prevProps.comeResponse) {
      this.resetComeResponse();
    }
    if (isNewVariant && isNewVariant !== prevProps.isNewVariant) {
      this.resetExpandedItemId();
    }
  }

  resetComeResponse = () => {
    const { resetComeResponse } = this.props;
    this.setState({ expandedItemId: null }, resetComeResponse);
  };

  resetExpandedItemId = () => {
    this.setState({ expandedItemId: null });
  };

  handleCreateVariant = (variant: {}) => {
    log.debug('handleCreateVariant', { variant });
  };

  handleSelectAll = () => {
    // TODO:
  };

  handleCollapseVariant = () => {
    this.setState({ expandedItemId: null });
  };

  expandRow = (id: number) => {
    if (this.state.expandedItemId && this.state.expandedItemId === id) {
      this.setState({ expandedItemId: null });
    } else {
      this.setState({ expandedItemId: id });
      this.props.toggleNewVariantParam(false);
    }
  };

  handleDeleteVariant = (id: string) => {
    this.props.handleDeleteVariant(id);
  };

  renderRows = (
    handleSaveBaseProductWithVariant: () => void,
    isLoading: boolean,
  ) => {
    const { expandedItemId } = this.state;
    return map(
      item => (
        <Fragment key={item.id}>
          <Row
            variant={item}
            onExpandClick={this.expandRow}
            handleDeleteVariant={this.handleDeleteVariant}
            isOpen={item.rawId === expandedItemId}
            notRemove={length(this.props.variants) === 1}
          />
          {propEq('rawId', expandedItemId, item) && (
            <Form
              isLoading={isLoading}
              category={this.props.category}
              variant={item}
              productRawId={this.props.productRawId}
              productId={this.props.productId}
              key={item.id}
              isExpanded
              onExpandClick={this.expandRow}
              storeID={this.props.storeID}
              handleCollapseVariant={this.handleCollapseVariant}
              handleSaveBaseProductWithVariant={
                handleSaveBaseProductWithVariant
              }
            />
          )}
        </Fragment>
      ),
      this.props.variants,
    );
  };

  render() {
    const { variants, isNewVariant, toggleNewVariantParam } = this.props;
    const { expandedItemId } = this.state;
    return (
      <ProductFormContext.Consumer>
        {({ isLoading, handleSaveBaseProductWithVariant }) => (
          <div
            styleName={classNames('container', {
              hiddenButton: expandedItemId || isNewVariant,
              newVariant: isEmpty(variants),
            })}
          >
            {!isEmpty(variants) && (
              <div styleName="table">
                <Header
                  onSelectAllClick={this.handleSelectAll}
                  notRemove={length(this.props.variants) === 1}
                />
                {this.renderRows(handleSaveBaseProductWithVariant, isLoading)}
              </div>
            )}
            {(isEmpty(variants) || isNewVariant) &&
              !expandedItemId && (
                <div styleName="emptyForm">
                  <Form
                    isLoading={isLoading}
                    category={this.props.category}
                    productRawId={this.props.productRawId}
                    productId={this.props.productId}
                    storeID={this.props.storeID}
                    handleSaveBaseProductWithVariant={
                      handleSaveBaseProductWithVariant
                    }
                    isNewVariant={isNewVariant}
                    toggleNewVariantParam={toggleNewVariantParam}
                  />
                </div>
              )}
          </div>
        )}
      </ProductFormContext.Consumer>
    );
  }
}

export default Table;
