// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { find, append, head, pathOr, map, isEmpty } from 'ramda';

import { Button } from 'components/common/Button';
import { Icon } from 'components/Icon';
import { log } from 'utils';
import {
  CreateProductWithAttributesMutation,
  UpdateProductMutation,
} from 'relay/mutations';
import { withShowAlert } from 'components/App/AlertContext';

import type { AddAlertInputType } from 'components/App/AlertContext';

import Characteristics from './Characteristics';
import Photos from './Photos';

import './Form.scss';

type AttributeValueType = {
  attrId: number,
  value: string,
  metaField?: {
    translations: Array<{ lang: string, text: string }>,
  },
};

type ValueForAttributeType = {
  value: string,
  metaField?: {
    translations: Array<{ lang: string, text: string }>,
  },
};

type StateType = {
  productId?: string,
  vendorCode?: string,
  price?: number,
  cashback?: ?number,
  isOpenVariantData?: boolean,
  mainPhoto?: ?string,
  photos?: Array<string>,
  price?: ?number,
  attributeValues?: Array<AttributeValueType>,
};

type PropsType = {
  showAlert: (input: AddAlertInputType) => void,
  productId: number,
  category: {
    getAttributes: Array<{
      rawId: number,
    }>,
  },
  variant: ?{
    id: string,
    vendorCode: string,
    price?: number,
    cashback?: ?number,
    photoMain?: ?string,
    additionalPhotos?: Array<string>,
  },
  onExpandClick: (id: string) => void,
};

type ValueForAttributeInputType = {
  attr: any,
  variant: any,
};

class Form extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    const product = props.variant;
    const attrValues: Array<AttributeValueType> = map(
      item => ({
        attrId: item.rawId,
        ...this.valueForAttribute({ attr: item, variant: props.variant }),
      }),
      props.category.getAttributes,
    );
    if (!product) {
      this.state = {
        attributeValues: attrValues,
      };
    } else {
      this.state = {
        productId: product.id,
        vendorCode: product.vendorCode,
        price: product.price,
        cashback: Math.round((product.cashback || 0) * 100),
        mainPhoto: product.photoMain,
        photos: product.additionalPhotos,
        attributeValues: attrValues,
      };
    }
  }

  state: StateType = {
    //
  };

  onChangeValues = (values: Array<AttributeValueType>) => {
    this.setState({ attributeValues: values });
  };

  handleUpdate = () => {
    const variant = this.state;
    log.debug({ variant });
    UpdateProductMutation.commit({
      id: variant.productId,
      product: {
        price: variant.price,
        vendorCode: variant.vendorCode,
        photoMain: variant.mainPhoto,
        additionalPhotos: variant.photos,
        cashback: variant.cashback ? variant.cashback / 100 : '',
      },
      attributes: variant.attributeValues,
      environment: this.context.environment,
      onCompleted: (response: ?Object, errors: ?Array<Error>) => {
        if (errors) {
          this.props.showAlert({
            type: 'danger',
            text: 'Check that fields are filled.',
            link: { text: 'Close.' },
          });
          return;
        }
        log.debug({ response, errors });
        window.location.reload(); // TODO: fix it!
      },
      onError: (error: Error) => {
        log.debug({ error });
        this.props.showAlert({
          type: 'danger',
          text: 'Check that fields are filled.',
          link: { text: 'Close.' },
        });
      },
    });
  };

  handleCreate = () => {
    const variant = this.state;
    log.debug({ variant });
    CreateProductWithAttributesMutation.commit({
      product: {
        baseProductId: this.props.productId,
        price: variant.price,
        vendorCode: variant.vendorCode,
        photoMain: variant.mainPhoto,
        additionalPhotos: variant.photos,
        cashback: variant.cashback ? variant.cashback / 100 : '',
      },
      attributes: variant.attributeValues,
      environment: this.context.environment,
      onCompleted: (response: ?Object, errors: ?Array<Error>) => {
        if (errors) {
          this.props.showAlert({
            type: 'danger',
            text: 'Check that fields are filled.',
            link: { text: 'Close.' },
          });
          return;
        }
        log.debug({ response, errors });
        window.location.reload(); // TODO: fix it!
      },
      onError: (error: Error) => {
        log.debug({ error });
        this.props.showAlert({
          type: 'danger',
          text: 'Check that fields are filled.',
          link: { text: 'Close.' },
        });
      },
    });
  };

  handleCheckboxClick = (id: any) => {
    log.info('id', id);
  };

  handleVendorCodeChange = (e: any) => {
    this.setState({ vendorCode: e.target.value });
  };

  handlePriceChange = (e: any) => {
    const {
      target: { value },
    } = e;
    if (value === '') {
      this.setState({ price: null });
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
    const id: string = pathOr('', ['rawId'], this.props.variant);
    if (this.props.onExpandClick) {
      this.props.onExpandClick(id);
    }
  };

  valueForAttribute = (
    input: ValueForAttributeInputType,
  ): ValueForAttributeType => {
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
            value={cashback || ''}
          />
          <span styleName="inputPostfix">%</span>
        </div>
        <div styleName="variantItem tdCharacteristics" />
        <div styleName="variantItem tdCount">
          <div styleName="storagesItem">
            <div styleName="storagesLabels">
              <div>1 storage</div>
              <div>2 storage</div>
            </div>
            <div styleName="storagesValues">
              <div>
                <strong>56</strong>
              </div>
              <div>
                <strong>67</strong>
              </div>
            </div>
          </div>
        </div>
        <div styleName="variantItem tdBasket" />
        <div styleName="variantItem tdDropdawn">
          <button styleName="arrowExpand" onClick={this.toggleDropdownVariant}>
            <Icon inline type="arrowExpand" />
          </button>
        </div>
      </div>
    );
  };

  render() {
    const { photos = [], mainPhoto } = this.state;
    return (
      <div styleName="container">
        <div styleName="variants">{this.renderVariant()}</div>
        <Photos
          photos={mainPhoto ? append(mainPhoto, photos) : photos}
          onAddPhoto={this.handleAddPhoto}
        />
        <Characteristics
          category={this.props.category}
          values={this.state.attributeValues || []}
          onChange={this.onChangeValues}
        />
        <Button
          type="button"
          onClick={this.props.variant ? this.handleUpdate : this.handleCreate}
          dataTest="variantsProductSaveButton"
        >
          Save
        </Button>
      </div>
    );
  }
}

Form.contextTypes = {
  environment: PropTypes.object.isRequired,
};

export default withShowAlert(Form);
