// @flow

import React, { PureComponent } from 'react';
import { map, pathOr, whereEq, filter, isEmpty } from 'ramda';

import { findCategory, convertSrc } from 'utils';
import { Input } from 'components/common/Input';
import { Textarea } from 'components/common/Textarea';
import { CategorySelector } from 'components/CategorySelector';
import { Button } from 'components/common/Button';
import { UploadWrapper } from 'components/Upload';
import { Icon } from 'components/Icon';
import { Container, Col, Row } from 'layout';
import { Select } from 'components/common/Select';

import AttributesForm from '../AttributesForm';
import ProductsUploader from '../ProductsUploader';

import type { AttrValueType } from '../AttributesForm';
import type { BaseProductNodeType } from '../../Wizard';

import './Form.scss';

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
  onUpload: (type: string, e: any) => Promise<*>,
  onSave: (callback: () => void) => void,
  onClose: () => void,
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

class ThirdForm extends PureComponent<PropsType> {
  // TODO: remove useless function
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

  handleChangeProductState = (e: any) => {
    const { data } = this.props;
    const {
      target: { value, name },
    } = e;
    this.props.onChange({
      ...data,
      product: {
        ...data.product,
        [name]: name === 'vendorCode' ? value : parseInt(value, 10),
      },
    });
  };

  handleAttributesChange = (attrs: Array<AttrValueType>) => {
    const { onChange } = this.props;
    onChange({ attributes: attrs });
  };

  handleRemoveAddtionalPhoto = (url: string) => {
    const { onChange, data } = this.props;
    onChange({
      product: {
        ...data.product,
        additionalPhotos: [
          ...filter(u => u !== url, data.product.additionalPhotos),
        ],
      },
    });
  };

  handleOnRemoveMainPhoto = () => {
    const { onChange, data } = this.props;
    onChange({
      product: {
        ...data.product,
        photoMain: '',
      },
    });
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
          <div styleName="sectionName">{t.properties}</div>
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
    const { data, onSave, onClose, onUpload } = this.props;
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
                    <div styleName="sectionName">{t.productMainPhoto}</div>
                    <div styleName="uploadersWrapper">
                      <div styleName="uploadedPhotoList">
                        {(data.product.photoMain && (
                          <div
                            styleName="uploadItem"
                            onClick={this.handleOnRemoveMainPhoto}
                            onKeyDown={() => {}}
                            role="button"
                            tabIndex="0"
                          >
                            <div
                              styleName="imageBG"
                              style={{
                                backgroundImage: `url(${convertSrc(
                                  data.product.photoMain,
                                  'small',
                                )})`,
                              }}
                              alt="mainPhoto"
                            />
                            <div styleName="itemHover">
                              <Icon type="basket" size={40} />
                            </div>
                          </div>
                        )) || (
                          <Row>
                            <Col size={12} mdHidden>
                              <UploadWrapper
                                id="upload_photo"
                                onUpload={e => {
                                  onUpload('photoMain', e);
                                }}
                                buttonHeight={10}
                                buttonWidth={10}
                                fullWidth
                                noIndents
                                buttonIconType="camera"
                                buttonIconSize={20}
                                buttonLabel={t.labelAddPhoto}
                                dataTest="productPhotosUploader"
                              />
                            </Col>
                            <Col size={12} mdVisible>
                              <UploadWrapper
                                id="upload_photo"
                                onUpload={e => {
                                  onUpload('photoMain', e);
                                }}
                                buttonHeight={10}
                                buttonWidth={10}
                                noIndents
                                buttonIconType="camera"
                                buttonIconSize={20}
                                buttonLabel={t.labelAddPhoto}
                                dataTest="productPhotosUploader"
                              />
                            </Col>
                          </Row>
                        )}
                      </div>
                    </div>
                  </div>
                  <div styleName="section">
                    <div styleName="sectionName">{t.productPhotoGallery}</div>
                    <ProductsUploader
                      onRemove={this.handleRemoveAddtionalPhoto}
                      onUpload={onUpload}
                      additionalPhotos={data.product.additionalPhotos || []}
                    />
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
                        categories={this.props.categories}
                        onSelect={id => this.props.onChange({ categoryId: id })}
                      />
                    </div>
                    <div styleName="productStates formItem">
                      <Container correct>
                        <Row>
                          <Col size={12} md={6}>
                            <div styleName="formItem">
                              <Input
                                id="price"
                                value={
                                  data.product.price == null
                                    ? ''
                                    : `${data.product.price}`
                                }
                                label={
                                  <span>
                                    {t.price} <span styleName="red">*</span>
                                  </span>
                                }
                                min="0"
                                onChange={this.handleChangeProductState}
                                fullWidth
                                type="number"
                              />
                            </div>
                          </Col>
                          <Col size={12} md={6}>
                            <div styleName="formItem">
                              <Select
                                items={[{ id: '1', label: 'STQ' }]}
                                activeItem={{ id: '1', label: 'STQ' }}
                                label="Currency"
                                forForm
                                containerStyle={{
                                  marginTop: '3rem',
                                }}
                                onSelect={() => {}}
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
                                    {t.vendorCode}{' '}
                                    <span styleName="red">*</span>
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
                                min="0"
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

export default ThirdForm;