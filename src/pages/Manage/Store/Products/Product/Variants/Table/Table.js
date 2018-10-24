// @flow

import React, { Component, Fragment } from 'react';
import { isEmpty, map, propEq, length, drop, head } from 'ramda';
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

  // renderRows = (
  //   handleSaveBaseProductWithVariant: () => void,
  //   isLoading: boolean,
  //   onChangeVariantForm: any,
  //   variantFormErrors: ?{
  //     vendorCode?: Array<string>,
  //     price?: Array<string>,
  //     attributes?: Array<string>,
  //   },
  //   resetVariantFormErrors: (field: string) => void,
  // ) => {
  //   const { variants } = this.props;
  //   const headVariant = head(variants);
  //   const { expandedItemId } = this.state;
  //   return (
  //     <Fragment>
  //       <Form
  //         category={this.props.category}
  //         variant={headVariant}
  //         productRawId={this.props.productRawId}
  //         productId={this.props.productId}
  //         isExpanded
  //         onExpandClick={this.expandRow}
  //         storeID={this.props.storeID}
  //         handleCollapseVariant={this.handleCollapseVariant}
  //         handleSaveBaseProductWithVariant={
  //           handleSaveBaseProductWithVariant
  //         }
  //         onChangeVariantForm={onChangeVariantForm}
  //         formErrors={variantFormErrors}
  //         resetVariantFormErrors={resetVariantFormErrors}
  //       />
  //       <Header
  //         onSelectAllClick={this.handleSelectAll}
  //         notRemove={length(variants) === 1}
  //       />
  //       {map(
  //         item => (
  //           <Fragment key={item.id}>
  //             <Row
  //               variant={item}
  //               onExpandClick={this.expandRow}
  //               handleDeleteVariant={this.handleDeleteVariant}
  //               isOpen={item.rawId === expandedItemId}
  //               notRemove={length(this.props.variants) === 1}
  //             />
  //             {propEq('rawId', expandedItemId, item) && (
  //               <Form
  //                 category={this.props.category}
  //                 variant={item}
  //                 productRawId={this.props.productRawId}
  //                 productId={this.props.productId}
  //                 key={item.id}
  //                 isExpanded
  //                 onExpandClick={this.expandRow}
  //                 storeID={this.props.storeID}
  //                 handleCollapseVariant={this.handleCollapseVariant}
  //                 handleSaveBaseProductWithVariant={
  //                   handleSaveBaseProductWithVariant
  //                 }
  //                 onChangeVariantForm={onChangeVariantForm}
  //                 formErrors={variantFormErrors}
  //                 resetVariantFormErrors={resetVariantFormErrors}
  //               />
  //             )}
  //           </Fragment>
  //         ),
  //         drop(1, variants),
  //       )}
  //     </Fragment>
  //   );
  // };

  render() {
    const { variants, isNewVariant } = this.props;
    const { expandedItemId } = this.state;
    const headVariant = head(variants);
    console.log('---variants', variants);
    return (
      <ProductFormContext.Consumer>
        {({
          isLoading,
          handleSaveBaseProductWithVariant,
          onChangeVariantForm,
          variantFormErrors,
          resetVariantFormErrors,
          customAttributes,
        }) => (
          <div
            styleName={classNames('container', {
              hiddenButton: expandedItemId || isNewVariant,
            })}
          >
            {console.log('---customAttributes', customAttributes)}
            {!isEmpty(variants) && (
              <div styleName="table">
                <Form
                  isMainVariant
                  category={this.props.category}
                  variant={headVariant}
                  productRawId={this.props.productRawId}
                  productId={this.props.productId}
                  isExpanded
                  onExpandClick={this.expandRow}
                  storeID={this.props.storeID}
                  handleCollapseVariant={this.handleCollapseVariant}
                  onChangeVariantForm={onChangeVariantForm}
                  formErrors={variantFormErrors}
                  resetVariantFormErrors={resetVariantFormErrors}
                  customAttributes={customAttributes}
                />
                {length(drop(1, variants)) > 0 && <Header onSelectAllClick={this.handleSelectAll} />}
                {map(
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
                          category={this.props.category}
                          variant={item}
                          productRawId={this.props.productRawId}
                          productId={this.props.productId}
                          isExpanded
                          onExpandClick={this.expandRow}
                          storeID={this.props.storeID}
                          handleCollapseVariant={this.handleCollapseVariant}
                          onChangeVariantForm={onChangeVariantForm}
                          formErrors={variantFormErrors}
                          resetVariantFormErrors={resetVariantFormErrors}
                          customAttributes={customAttributes}
                        />
                      )}
                    </Fragment>
                  ),
                  drop(1, variants),
                )}
              </div>
            )}
            {(isEmpty(variants) || isNewVariant) &&
              !expandedItemId && (
                <div styleName="emptyForm">
                  <Form
                    category={this.props.category}
                    productRawId={this.props.productRawId}
                    productId={this.props.productId}
                    storeID={this.props.storeID}
                    handleSaveBaseProductWithVariant={
                      handleSaveBaseProductWithVariant
                    }
                    onChangeVariantForm={onChangeVariantForm}
                    formErrors={variantFormErrors}
                    resetVariantFormErrors={resetVariantFormErrors}
                    customAttributes={customAttributes}
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
