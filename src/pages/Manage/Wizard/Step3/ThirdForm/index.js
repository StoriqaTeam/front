// @flow

import React, { Component } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { map, pathOr, whereEq, filter, isEmpty, find } from 'ramda';

import { findCategory, convertCurrenciesForSelect } from 'utils';
import { InputPrice, Input, Button, Select } from 'components/common';
import { Textarea } from 'components/common/Textarea';
import { CategorySelector } from 'components/CategorySelector';
import { Icon } from 'components/Icon';
import { Container, Col, Row } from 'layout';
import Photos from 'pages/Manage/Store/Products/Product/Photos';
import { ContextDecorator } from 'components/App';

import AttributesForm from '../AttributesForm';

import type { AttrValueType } from '../AttributesForm';
import type { BaseProductNodeType } from '../../Wizard';

import './ThirdForm.scss';

import t from './i18n';

type CategoriesTreeType = {
  rawId: number,
  level: number,
  children: ?Array<CategoriesTreeType>,
};

type PropsType = {
  categoryId?: ?number,
  categories: CategoriesTreeType,
  onChange: ({
    [name: string]: any,
  }) => void,
  data: BaseProductNodeType,
  onUploadMainPhoto: (url: string) => void,
  onUploadAdditionalPhotos: (photosUrls: Array<string>) => void,
  onSave: (callback: () => void) => void,
  onClose: () => void,
  isSavingInProgress: boolean,
  allCategories: CategoriesTreeType,
  directories: {
    sellerCurrencies: Array<string>,
  },
};

type StateType = {
  selectedCurrency: { label: string, id: string },
};

const photoIcons = [
  {
    type: 'mainFoto',
    text: t.iconAddMainPhoto,
  },
  {
    type: 'angleView',
    text: t.iconAddAngleView,
  },
  {
    type: 'showDetails',
    text: t.iconShowDetails,
  },
  {
    type: 'showInScene',
    text: t.iconShowInScene,
  },
  {
    type: 'showInUse',
    text: t.iconShowInUse,
  },
  {
    type: 'showSizes',
    text: t.iconShowSizes,
  },
  {
    type: 'showVariety',
    text: t.iconShowVariety,
  },
];

class ThirdForm extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    const { sellerCurrencies } = this.props.directories;
    const currencies = convertCurrenciesForSelect(sellerCurrencies);
    const selectedCurrency = find(
      item => item.label === this.props.data.currency,
      currencies,
    );
    this.state = {
      selectedCurrency: selectedCurrency || currencies[0],
    };
  }
  handleChangeBaseProductState = (e: any) => {
    const { data } = this.props;
    const {
      target: { value, name },
    } = e;
    this.props.onChange({
      ...data,
      [name]: value,
    });
  };

  handleChangeProductState = (e: SyntheticInputEvent<HTMLInputElement>) => {
    const { data } = this.props;
    const { name } = e.target;
    let { value } = e.target;
    if (name === 'cashback') {
      if (parseInt(value, 10) > 100) {
        value = '100';
      }
      if (value === '') {
        value = '0';
      }
    }
    const lastValue = `${data.product[name]}`;

    if (parseInt(value, 10) < 0 || value.length === 0) {
      value = '0';
    }

    if (isEmpty(value)) {
      value = lastValue;
    }

    this.props.onChange({
      ...data,
      product: {
        ...data.product,
        [name]: name === 'vendorCode' ? value : parseInt(value, 10),
      },
    });
  };

  handleChangePrice = (price: number) => {
    const { data } = this.props;
    this.props.onChange({
      ...data,
      product: {
        ...data.product,
        price,
      },
    });
  };

  handleChangeCurrency = (selectedCurrency: { label: string, id: string }) => {
    const { data } = this.props;
    this.setState(
      {
        selectedCurrency,
      },
      () => {
        this.props.onChange({
          ...data,
          currency: selectedCurrency.label,
        });
      },
    );
  };

  handleAttributesChange = (attrs: Array<AttrValueType>) => {
    const { onChange } = this.props;
    onChange({ attributes: attrs });
  };

  prepareValuesForAttributes = (
    attributes: Array<{ value: string, attribute: { rawId: number } }>,
  ) =>
    map(
      item => ({ value: item.value, attrId: item.attribute.rawId }),
      attributes,
    );

  checkForSave = () => {
    const { data } = this.props;
    const isNotReady =
      !data.name ||
      !data.shortDescription ||
      !data.categoryId ||
      !data.product.price ||
      !data.product.vendorCode;
    if (isNotReady) {
      return true;
    }
    return false;
  };

  handleAddMainPhoto = (url: string): void => {
    this.props.onUploadMainPhoto(url);
  };

  handleAddPhoto = (photosUrls: Array<string>): void => {
    this.props.onUploadAdditionalPhotos(photosUrls);
  };

  handleRemovePhoto = (url: string): void => {
    const { onChange, data } = this.props;
    const { photoMain, additionalPhotos } = data.product;
    if (url === photoMain) {
      onChange({
        product: {
          ...data.product,
          photoMain: '',
        },
      });
      return;
    }

    onChange({
      product: {
        ...data.product,
        additionalPhotos: filter(item => item !== url, additionalPhotos || []),
      },
    });
  };

  renderAttributes = () => {
    const { categoryId, attributes } = this.props.data;
    const catObj = findCategory(
      whereEq({ rawId: parseInt(categoryId, 10) }),
      this.props.categories,
    );
    return (
      catObj &&
      catObj.getAttributes &&
      !isEmpty(catObj.getAttributes) && (
        <div styleName="section correctMargin">
          <div styleName="sectionName">{t.characteristics}</div>
          <AttributesForm
            attributes={catObj.getAttributes}
            values={attributes}
            onChange={this.handleAttributesChange}
          />
        </div>
      )
    );
  };

  render() {
    const {
      data,
      onSave,
      onClose,
      isSavingInProgress,
      allCategories,
      directories,
    } = this.props;
    const { selectedCurrency } = this.state;
    // $FlowIgnoreMe
    const categoryId = pathOr(null, ['data', 'categoryId'], this.props);
    return (
      <div styleName="wrapper">
        <div styleName="formWrapper">
          <Container correct>
            <Row>
              <Col size={12}>
                <div styleName="centered">
                  <div styleName="headerTitle">{t.addNewProduct}</div>
                  <div styleName="headerDescription">
                    {t.chooseWhatYouGonnaSale}
                  </div>
                </div>
              </Col>
              <Col size={12}>
                <div styleName="form">
                  <div styleName="section">
                    <div styleName="input">
                      <Input
                        id="name"
                        value={data.name}
                        label={
                          <span>
                            {t.labelProductName} <span styleName="red">*</span>
                          </span>
                        }
                        onChange={this.handleChangeBaseProductState}
                        fullWidth
                      />
                    </div>
                    <div styleName="input">
                      <Textarea
                        id="shortDescription"
                        value={data.shortDescription}
                        label={
                          <span>
                            {t.labelShortDescription}{' '}
                            <span styleName="red">*</span>
                          </span>
                        }
                        onChange={this.handleChangeBaseProductState}
                        fullWidth
                      />
                    </div>
                  </div>
                  <div styleName="section correctMargin">
                    <div styleName="sectionName">{t.productPhotos}</div>
                    <div styleName="uploadersWrapper">
                      <Photos
                        photos={data.product.additionalPhotos || []}
                        photoMain={data.product.photoMain}
                        onAddMainPhoto={this.handleAddMainPhoto}
                        onAddPhoto={this.handleAddPhoto}
                        onRemovePhoto={this.handleRemovePhoto}
                      />
                    </div>
                  </div>
                  <div styleName="section">
                    <div styleName="uploadDescriptionContainer">
                      <div styleName="description">
                        {t.forBetterProductAppeareance}
                      </div>
                      <div styleName="iconsWrapper">
                        <div styleName="iconsContainer">
                          {map(
                            icon => (
                              <div key={icon.type} styleName="iconBlock">
                                <Icon type={icon.type} size={56} />
                                <div styleName="iconDescription">
                                  {icon.text}
                                </div>
                              </div>
                            ),
                            photoIcons,
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div styleName="section">
                    <div styleName="sectionName">
                      {t.generalSettingsAndPricing}
                    </div>
                    <div styleName="categorySelector">
                      <CategorySelector
                        categories={allCategories}
                        onSelect={id => this.props.onChange({ categoryId: id })}
                        category={{ rawId: data.categoryId }}
                      />
                    </div>
                    <div styleName="productStates formItem">
                      <Container correct>
                        <Row>
                          <Col size={12} md={6}>
                            <div styleName="formItem">
                              <InputPrice
                                id="price"
                                label={t.price}
                                required
                                onChangePrice={this.handleChangePrice}
                                price={
                                  !data.product.price ? 0 : data.product.price
                                }
                                min="0"
                                fullWidth
                                dataTest="wizardProductPriceInput"
                              />
                            </div>
                          </Col>
                          <Col size={12} md={6}>
                            <div styleName="formItem">
                              <Select
                                items={convertCurrenciesForSelect(
                                  directories.sellerCurrencies,
                                )}
                                activeItem={selectedCurrency}
                                label="Currency"
                                forForm
                                containerStyle={{
                                  marginTop: '3rem',
                                  width: '100%',
                                }}
                                onSelect={this.handleChangeCurrency}
                                dataTest="step3Currency"
                              />
                            </div>
                          </Col>
                          <Col size={12} md={6}>
                            <div styleName="formItem">
                              <Input
                                id="vendorCode"
                                value={
                                  data.product.vendorCode == null
                                    ? ''
                                    : `${data.product.vendorCode}`
                                }
                                label={
                                  <span>
                                    {t.SKU} <span styleName="red">*</span>
                                  </span>
                                }
                                onChange={this.handleChangeProductState}
                                fullWidth
                              />
                            </div>
                          </Col>
                          <Col size={12} md={6}>
                            <div styleName="formItem">
                              <Input
                                id="cashback"
                                value={
                                  data.product.cashback == null
                                    ? ''
                                    : `${data.product.cashback}`
                                }
                                label={t.labelCashback}
                                onChange={this.handleChangeProductState}
                                fullWidth
                                type="number"
                                postfix="%"
                              />
                            </div>
                          </Col>
                          <Col size={12} md={6}>
                            <div styleName="formItem">
                              <Input
                                id="quantity"
                                value={
                                  data.product.quantity == null
                                    ? '0'
                                    : `${data.product.quantity}`
                                }
                                label={t.labelQuantity}
                                onChange={this.handleChangeProductState}
                                fullWidth
                                type="number"
                                min="0"
                              />
                            </div>
                          </Col>
                        </Row>
                      </Container>
                    </div>
                  </div>
                  {categoryId && this.renderAttributes()}
                  <div styleName="buttons">
                    <div styleName="buttonContainer">
                      <Button
                        onClick={() => {
                          onSave(onClose);
                        }}
                        dataTest="wizardSaveProductButton"
                        big
                        disabled={this.checkForSave()}
                        fullWidth
                        isLoading={isSavingInProgress}
                      >
                        <span>{t.save}</span>
                      </Button>
                    </div>
                    <div styleName="buttonContainer">
                      <div
                        styleName="cancelButton"
                        onClick={onClose}
                        onKeyDown={() => {}}
                        role="button"
                        tabIndex="0"
                      >
                        <span>{t.cancel}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    );
  }
}

export default createFragmentContainer(
  ContextDecorator(ThirdForm),
  graphql`
    fragment ThirdForm_allCategories on Category {
      name {
        lang
        text
      }
      children {
        id
        rawId
        parentId
        level
        name {
          lang
          text
        }
        children {
          id
          rawId
          parentId
          level
          name {
            lang
            text
          }
          children {
            id
            rawId
            parentId
            level
            name {
              lang
              text
            }
            getAttributes {
              id
              rawId
              name {
                text
                lang
              }
              metaField {
                values
                translatedValues {
                  translations {
                    text
                  }
                }
              }
            }
          }
        }
      }
    }
  `,
);
