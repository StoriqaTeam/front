// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { find, append, head, pathOr, map, complement, isEmpty } from 'ramda';

import { Button } from 'components/Button';
import { Checkbox } from 'components/Checkbox';
import { Icon } from 'components/Icon';
import { log } from 'utils';
import { CreateProductWithAttributesMutation, UpdateProductMutation } from 'relay/mutations';

import Characteristics from './Characteristics';
import Photos from './Photos';

import './Form.scss';

type StateType = {
  productId?: string,
  vendorCode?: string,
  price?: number,
  cashback?: ?number,
  isOpenVariantData?: boolean,
  mainPhoto?: ?string,
  photos?: Array<string>,
  attributeValues?: Array<{ attrId: string, value: string, metaField?: string }>,
  price?: ?number,
};

type PropsType = {
  productId: number,
  category: { getAttributes: Array<{}> },
  variant: ?{},
  onExpandClick: (id: string) => void,
};

class Form extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    const product = pathOr(null, ['variant'], props);
    const attributeValues = map(item => ({
      attrId: item.rawId,
      ...this.valueForAttribute({ attr: item, variant: props.variant }),
    }), props.category.getAttributes);
    if (!product) {
      this.state = {
        attributeValues,
      };
    } else {
      this.state = {
        productId: product.id,
        vendorCode: product.vendorCode,
        price: product.price,
        cashback: product.cashback,
        mainPhoto: product.photoMain,
        photos: product.additionalPhotos,
        attributeValues,
      };
    }
  }

  state: StateType = {
    //
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
        cashback: variant.cashback,
      },
      attributes: variant.attributeValues,
      environment: this.context.environment,
      onCompleted: (response: ?Object, errors: ?Array<Error>) => {
        if (errors) {
          alert('Check that fields are filled.'); // eslint-disable-line
          return;
        }
        log.debug({ response, errors });
        window.location.reload(); // TODO: fix it!
      },
      onError: (error: Error) => {
        log.debug({ error });
        alert('Check that fields are filled.'); // eslint-disable-line
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
        cashback: variant.cashback,
      },
      attributes: variant.attributeValues,
      environment: this.context.environment,
      onCompleted: (response: ?Object, errors: ?Array<Error>) => {
        if (errors) {
          alert('Check that fields are filled.'); // eslint-disable-line
          return;
        }
        log.debug({ response, errors });
        window.location.reload(); // TODO: fix it!
      },
      onError: (error: Error) => {
        log.debug({ error });
        alert('Check that fields are filled correctly.'); // eslint-disable-line
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
    const { target: { value } } = e;
    if (value === '') {
      this.setState({ price: null });
      return;
    } else if (Number.isNaN(parseFloat(value))) {
      return;
    }
    this.setState({ price: parseFloat(value) });
  };

  handleCashbackChange = (e: any) => {
    const { target: { value } } = e;
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
      this.setState(prevState => ({ photos: append(url, prevState.photos) }));
    }
  };

  toggleDropdownVariant = () => {
    const id = pathOr(null, ['variant', 'rawId'], this.props);
    if (this.props.onExpandClick) {
      this.props.onExpandClick(id);
    }
  };

  valueForAttribute = ({ attr, variant }: { [string]: any }):
    { value: string, metaField?: string } => {
    const attrFromVariant =
      variant && find(item => item.attribute.rawId === attr.rawId, variant.attributes);
    if (attrFromVariant && attrFromVariant.value) {
      return {
        value: attrFromVariant.value,
        metaField: attrFromVariant.metaField,
      };
    }
    const { values, translatedValues } = attr.metaField;
    if (values) {
      return {
        value: head(values),
      };
    } else if (translatedValues && complement(isEmpty(translatedValues))) {
      return {
        value: pathOr('', [0, 'translations', 0, 'text'], translatedValues),
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
        <div styleName="variantItem tdCheckbox">
          <Checkbox
            id="id-variant"
            onChange={this.handleCheckboxClick}
          />
        </div>
        <div styleName="variantItem tdDropdawn">
          <button onClick={this.toggleDropdownVariant}>
            <Icon inline type="openArrow" />
          </button>
        </div>
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
        <div styleName="variantItem tdCount">8</div>
        <div styleName="variantItem tdBasket">
          <button>
            <Icon type="basket" />
          </button>
        </div>
      </div>
    );
  };

  render() {
    const { photos, mainPhoto } = this.state;
    return (
      <div>
        <div styleName="variants">
          {this.renderVariant()}
        </div>
        {/* $FlowIgnoreMe */}
        <Characteristics
          category={this.props.category}
          values={this.state.attributeValues || []}
          onChange={(values: Array<{ attrId: string, value: string, metaField?: string }>) => {
            this.setState({ attributeValues: values });
          }}
        />
        {/* $FlowIgnoreMe */}
        <Photos
          photos={mainPhoto ? append(mainPhoto, photos) : photos}
          onAddPhoto={this.handleAddPhoto}
        />
        <Button
          type="button"
          onClick={this.props.variant ? this.handleUpdate : this.handleCreate}
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

export default Form;
