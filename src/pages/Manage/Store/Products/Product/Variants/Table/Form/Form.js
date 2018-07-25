// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { find, append, head, pathOr, map, isEmpty } from 'ramda';

import { Button } from 'components/common/Button';
import { Icon } from 'components/Icon';
import { log, fromRelayError } from 'utils';
import { withShowAlert } from 'components/App/AlertContext';

import {
  CreateProductWithAttributesMutation,
  UpdateProductMutation,
} from 'relay/mutations';
import type { MutationParamsType as UpdateProductMutationType } from 'relay/mutations/UpdateProductMutation';
import type { MutationParamsType as CreateProductWithAttributesMutationType } from 'relay/mutations/CreateProductWithAttributesMutation';

import type { AddAlertInputType } from 'components/App/AlertContext';

import Characteristics from './Characteristics';
import Photos from './Photos';
import Warehouses from './Warehouses';

import './Form.scss';

type AttributeValueType = {
  attrId: number,
  value: string,
  metaField?: ?string,
};

type StateType = {
  productRawId: ?string,
  vendorCode?: string,
  price?: number,
  cashback?: ?number,
  mainPhoto?: ?string,
  photos?: Array<string>,
  attributeValues?: Array<AttributeValueType>,
};

type PropsType = {
  showAlert: (input: AddAlertInputType) => void,
  productRawId: number,
  productId: string,
  category: {
    getAttributes: Array<{
      rawId: number,
    }>,
  },
  variant: ?{
    id: string,
    productRawId: string,
    vendorCode: string,
    price?: number,
    cashback?: ?number,
    photoMain?: ?string,
    additionalPhotos?: Array<string>,
    stocks: {
      id: string,
      productId: number,
      warehouseId: string,
      quantity: number,
      warehouse: {
        name: string,
        addressFull: {
          value: string,
        },
      },
    },
  },
  onExpandClick: (id: string) => void,
  handleCollapseVariant: () => void,
};

type ValueForAttributeInputType = {
  attr: any,
  variant: any,
};

class Form extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    const product = props.variant;
    if (!product) {
      this.state = {
        attributeValues: this.resetAttrValues(),
        productRawId: null,
      };
    } else {
      this.state = {
        productRawId: product.id,
        vendorCode: product.vendorCode,
        price: product.price,
        cashback: Math.round((product.cashback || 0) * 100),
        mainPhoto: product.photoMain,
        photos: product.additionalPhotos,
        attributeValues: this.resetAttrValues(),
      };
    }
  }

  onChangeValues = (values: Array<AttributeValueType>) => {
    this.setState({ attributeValues: values });
  };

  handleUpdate = () => {
    const { environment } = this.context;
    const variant = this.state;
    if (!variant.productRawId) {
      this.props.showAlert({
        type: 'danger',
        text: 'Something going wrong :(',
        link: { text: 'Close.' },
      });
      return;
    }
    const params: UpdateProductMutationType = {
      input: {
        clientMutationId: '',
        id: variant.productRawId,
        product: {
          price: variant.price,
          vendorCode: variant.vendorCode,
          photoMain: variant.mainPhoto,
          additionalPhotos: variant.photos,
          cashback: variant.cashback ? variant.cashback / 100 : null,
        },
        attributes: variant.attributeValues,
      },
      environment,
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
        log.debug({ response, errors });

        const relayErrors = fromRelayError({ source: { errors } });
        log.debug({ relayErrors });

        // $FlowIgnoreMe
        const validationErrors = pathOr({}, ['100', 'messages'], relayErrors);
        if (!isEmpty(validationErrors)) {
          this.props.showAlert({
            type: 'danger',
            text: 'Validation Error!',
            link: { text: 'Close.' },
          });
          return;
        }

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

        // $FlowIgnoreMe
        const parsingError = pathOr(null, ['300', 'message'], relayErrors);
        if (parsingError) {
          log.debug('parsingError:', { parsingError });
          this.props.showAlert({
            type: 'danger',
            text: 'Something going wrong :(',
            link: { text: 'Close.' },
          });
          return;
        }
        this.props.showAlert({
          type: 'success',
          text: 'Product update!',
          link: { text: '' },
        });
        this.props.handleCollapseVariant();
      },
      onError: (error: Error) => {
        log.error(error);
        this.props.showAlert({
          type: 'danger',
          text: 'Something going wrong.',
          link: { text: 'Close.' },
        });
      },
    };
    UpdateProductMutation.commit(params);
  };

  handleCreate = () => {
    const { environment } = this.context;
    const {
      price,
      vendorCode,
      mainPhoto,
      photos,
      cashback,
      attributeValues,
    } = this.state;
    if (!price || !vendorCode) {
      this.props.showAlert({
        type: 'danger',
        text: 'Something going wrong.',
        link: { text: 'Close.' },
      });
      return;
    }
    const params: CreateProductWithAttributesMutationType = {
      input: {
        clientMutationId: '',
        product: {
          baseProductId: this.props.productRawId,
          price,
          vendorCode,
          photoMain: mainPhoto,
          additionalPhotos: photos,
          cashback: cashback ? cashback / 100 : null,
        },
        attributes: attributeValues || [],
      },
      parentID: this.props.productId,
      environment,
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
        log.debug({ response, errors });

        const relayErrors = fromRelayError({ source: { errors } });
        log.debug({ relayErrors });

        // $FlowIgnoreMe
        const validationErrors = pathOr({}, ['100', 'messages'], relayErrors);
        if (!isEmpty(validationErrors)) {
          this.props.showAlert({
            type: 'danger',
            text: 'Validation Error!',
            link: { text: 'Close.' },
          });
          return;
        }

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

        // $FlowIgnoreMe
        const parsingError = pathOr(null, ['300', 'message'], relayErrors);
        if (parsingError) {
          log.debug('parsingError:', { parsingError });
          this.props.showAlert({
            type: 'danger',
            text: 'Something going wrong :(',
            link: { text: 'Close.' },
          });
          return;
        }
        this.props.showAlert({
          type: 'success',
          text: 'Variant created!',
          link: { text: '' },
        });
        this.setState({
          attributeValues: this.resetAttrValues(),
          productRawId: null,
          vendorCode: '',
          price: 0,
          cashback: null,
          mainPhoto: null,
          photos: [],
        });
        // this.props.handleCollapseVariant();
      },
      onError: (error: Error) => {
        log.error(error);
        this.props.showAlert({
          type: 'danger',
          text: 'Something going wrong.',
          link: { text: 'Close.' },
        });
      },
    };
    CreateProductWithAttributesMutation.commit(params);
  };

  resetAttrValues = () => {
    const attrValues: Array<AttributeValueType> = map(
      item => ({
        attrId: item.rawId,
        ...this.valueForAttribute({ attr: item, variant: this.props.variant }),
      }),
      this.props.category.getAttributes,
    );
    return attrValues;
  };

  handleVendorCodeChange = (e: any) => {
    this.setState({ vendorCode: e.target.value });
  };

  handlePriceChange = (e: any) => {
    const {
      target: { value },
    } = e;
    if (value === '') {
      this.setState({ price: 0 });
      return;
    } else if (Number.isNaN(parseFloat(value))) {
      return;
    }
    this.setState({ price: parseFloat(value) });
  };

  handleCashbackChange = (e: any) => {
    const {
      target: { value },
    } = e;
    if (value === '') {
      this.setState({ cashback: null });
      return;
    } else if (value === 0) {
      this.setState({ cashback: 0 });
      return;
    } else if (value > 100) {
      this.setState({ cashback: 99 });
      return;
    } else if (Number.isNaN(parseFloat(value))) {
      return;
    }
    this.setState({ cashback: parseFloat(value) });
  };

  handleAddPhoto = (url: string) => {
    if (!this.state.mainPhoto) {
      this.setState({ mainPhoto: url });
    } else {
      this.setState((prevState: StateType) => ({
        photos: append(url, prevState.photos || []),
      }));
    }
  };

  toggleDropdownVariant = () => {
    // $FlowIgnoreMe
    const id: string = pathOr(null, ['rawId'], this.props.variant);
    if (this.props.onExpandClick) {
      this.props.onExpandClick(id);
    }
  };

  valueForAttribute = (
    input: ValueForAttributeInputType,
  ): { value: string, metaField?: string } => {
    const { attr, variant } = input;
    const attrFromVariant =
      variant &&
      find(item => item.attribute.rawId === attr.rawId, variant.attributes);
    if (attrFromVariant && attrFromVariant.value) {
      return {
        value: attrFromVariant.value,
        metaField: attrFromVariant.metaField,
      };
    }
    const { values, translatedValues } = attr.metaField;
    if (values) {
      return {
        value: head(values) || '',
      };
    } else if (translatedValues && !isEmpty(translatedValues)) {
      return {
        // $FlowIgnoreMe
        value: pathOr(
          '',
          // $FlowIgnoreMe
          [0, 'translations', 0, 'text'],
          translatedValues || [],
        ),
      };
    }
    return {
      value: '',
    };
  };

  renderVariant = () => {
    const { variant } = this.props;
    const { vendorCode, price, cashback } = this.state;
    return (
      <div styleName="variant">
        <div styleName="variantItem tdCheckbox" />
        <div styleName="variantItem tdArticle">
          <input
            styleName="input vendorCodeInput"
            type="text"
            onChange={this.handleVendorCodeChange}
            value={vendorCode || ''}
          />
        </div>
        <div styleName="variantItem tdPrice">
          <input
            styleName="input priceInput"
            type="text"
            onChange={this.handlePriceChange}
            value={price || ''}
          />
          <span styleName="inputPostfix">STQ</span>
        </div>
        <div styleName="variantItem tdCashback">
          <input
            styleName="input cashbackInput"
            type="text"
            onChange={this.handleCashbackChange}
            value={cashback != null ? cashback : ''}
          />
          <span styleName="inputPostfix">%</span>
        </div>
        <div styleName="variantItem tdCharacteristics" />
        <div styleName="variantItem tdCount" />
        <div styleName="variantItem tdBasket" />
        <div styleName="variantItem tdDropdawn">
          {variant && (
            <button
              styleName="arrowExpand"
              onClick={this.toggleDropdownVariant}
            >
              <Icon inline type="arrowExpand" />
            </button>
          )}
        </div>
      </div>
    );
  };

  render() {
    const { category, variant } = this.props;
    const { photos = [], mainPhoto } = this.state;
    return (
      <div styleName="container">
        <div styleName="variants">{this.renderVariant()}</div>
        <Photos
          photos={mainPhoto ? append(mainPhoto, photos) : photos}
          onAddPhoto={this.handleAddPhoto}
        />
        <Characteristics
          category={category}
          values={this.state.attributeValues || []}
          onChange={this.onChangeValues}
        />
        {variant &&
          variant.stocks &&
          !isEmpty(variant.stocks) && <Warehouses stocks={variant.stocks} />}
        <div styleName="buttons">
          <Button
            big
            type="button"
            onClick={variant ? this.handleUpdate : this.handleCreate}
            dataTest="variantsProductSaveButton"
          >
            Save
          </Button>
          {variant && (
            <button
              styleName="cancelButton"
              onClick={this.props.handleCollapseVariant}
              data-test="cancelEditVariantButton"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    );
  }
}

Form.contextTypes = {
  environment: PropTypes.object.isRequired,
};

export default withShowAlert(Form);
