// @flow

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {append, filter, head, pathOr, propEq, map} from 'ramda';

import { Button } from 'components/Button';
import { Checkbox } from 'components/Checkbox';
import { Icon } from 'components/Icon';
import { log } from 'utils';
import { CreateProductWithAttributesMutation } from 'relay/mutations';

import Characteristics from './Characteristics';
import Photos from './Photos';

import './Form.scss';

type PropsType = {
  productId: number,
  onSave: Function,
  category: {},
  variant: ?{},
};

type StateType = {
  vendorCode: string,
  price: number,
  cashback: number,
  isOpenVariantData: boolean,
  mainPhoto: ?string,
  photos: Array<string>,
  attributeValues: Array<{ attrId: string, value: string, metaField?: string }>,
};

class Form extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      vendorCode: props.vendorCode,
      price: props.price,
      cashback: props.cashback,
      isOpenVariantData: true,
      mainPhoto: null,
      photos: [],
      attributeValues: map(item => ({
        attrId: item.rawId,
        value: this.valueForAttribute(item),
      }), this.props.category.getAttributes),
    };
  }

  state: StateType = {
    //
  };

  handleUpdate = () => {
    const {
      vendorCode,
      price,
      cashback,
    } = this.state;
    this.props.onSave({
      vendorCode,
      price,
      cashback,
    });
  };

  /* {
      "vendorCode": "asdfasdf",
      "price": 123,
      "cashback": 11,
      "isOpenVariantData": true,
      "mainPhoto": "https://s3.amazonaws.com/storiqa-dev/img-zP4BrAI0HNcC.png",
      "photos": [
        "https://s3.amazonaws.com/storiqa-dev/img-LhNA4aWDbAkC.png"
      ],
      "attributeValues": [
        {
          "attrId": 1,
          "value": "50",
          "metaField": "https://s3.amazonaws.com/storiqa-dev/img-mzcqk7BUenkC.png"
        }
      ]
    } */
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
        log.debug({ response, errors });
      },
      onError: (error: Error) => {
        log.debug({ error });
        alert('Проверьте правильность введенных данных'); // eslint-disable-line
      },
    });
  };

  handleCheckboxClick = (id) => {
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
    this.setState({isOpenVariantData: !this.state.isOpenVariantData});
  };

  valueForAttribute =(attribute: {}) => {
    if (attribute.value) {
      return attribute.value;
    }
    const { values, translatedValues } = attribute.metaField;
    if (values) {
      return head(values);
    } else if (translatedValues) {
      return pathOr('', [0, 'text'], translatedValues);
    }
    return '';
  };

  renderVariant = () => {
    const {
      vendorCode,
      price,
      cashback,
      isOpenVariantData,
    } = this.state;
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
            <Icon inline type={isOpenVariantData ? 'openArrow' : 'closeArrow'} />
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
        <div styleName="variantItem tdCharacteristics">Characteristics</div>
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
        <Characteristics
          category={this.props.category}
          values={this.state.attributeValues}
          onChange={values => this.setState({ attributeValues: values })}
        />
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
