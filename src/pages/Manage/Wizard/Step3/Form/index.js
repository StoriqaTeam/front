// @flow

import React, { PureComponent } from 'react';
import { map, pathOr, whereEq, filter, isEmpty } from 'ramda';

import { findCategory } from 'utils';
import { Input } from 'components/common/Input';
import { Textarea } from 'components/common/Textarea';
import { CategorySelector } from 'components/CategorySelector';
import { Button } from 'components/common/Button';
import { Icon } from 'components/Icon';
import { Container, Col, Row } from 'layout';
import { Select } from 'components/common/Select';
import Photos from 'pages/Manage/Store/Products/Product/Photos';

import AttributesForm from '../AttributesForm';

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
  onUploadPhoto: (type: string, url: string) => void,
  onSave: (callback: () => void) => void,
  onClose: () => void,
  isSavingInProgress: boolean,
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
    if (parseInt(value, 10) < 0) {
      value = '0';
    }
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

  handleAddMainPhoto = (url: string) => {
    this.props.onUploadPhoto('main', url);
  };

  handleAddPhoto = (url: string) => {
    this.props.onUploadPhoto('additional', url);
  };

  handleRemovePhoto = (url: string) => {
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
    const { data, onSave, onClose, isSavingInProgress } = this.props;
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
                        categories={this.props.categories}
                        onSelect={id => this.props.onChange({ categoryId: id })}
                        category={{ rawId: data.categoryId }}
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
                                  width: '100%',
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

export default ThirdForm;
