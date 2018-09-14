// @flow strict

import React from 'react';
import { createFragmentContainer, graphql } from 'react-relay';
import { isEmpty, map, assoc, omit, is } from 'ramda';

import { FormComponent, validators } from 'components/Forms/lib';
import { Container, Col, Row } from 'layout';
import { Input } from 'components/common/Input';
import { Textarea } from 'components/common/Textarea';
import { CategorySelector } from 'components/CategorySelector';
import { Button } from 'components/common/Button';
import { UploadWrapper } from 'components/Upload';
import { Icon } from 'components/Icon';
import { Select } from 'components/common/Select';
import { withShowAlert } from 'components/App/AlertContext';
import { convertSrc, log, uploadFile } from 'utils';

import type { Node } from 'react';

import ProductsUploader from './ProductsUploader';
import { createProductMutation } from './mutations/WizardCreateProductWithAttributesMutation';
import { createBaseProductMutation } from './mutations/WizardCreateBaseProductMutation';

import type { ProductForm_rootCategory as ProductFormRootCategory } from './__generated__/ProductForm_rootCategory.graphql';
import type { ProductForm_store as ProductFormStore } from './__generated__/ProductForm_store.graphql';

import './ProductForm.scss';

type FormInputs = {
  name: string,
  desc: string,
  categoryId: number,
  price: number,
  currency: { id: string, label: string },
  vendorCode: string,
  cashback: number,
  quantity: number,
  mainPhoto: ?string,
  additionalPhotos: Array<string>,
  attributes: Array<{}>,
};

type PropsType = {
  rootCategory: ?ProductFormRootCategory,
  store: ?ProductFormStore,
};

const photoIcons = [
  {
    type: 'mainFoto',
    text: 'Add main photo',
  },
  {
    type: 'angleView',
    text: 'Add angle view',
  },
  {
    type: 'showDetails',
    text: 'Show details',
  },
  {
    type: 'showInScene',
    text: 'Show in scene',
  },
  {
    type: 'showInUse',
    text: 'Show in use',
  },
  {
    type: 'showSizes',
    text: 'Show sizes',
  },
  {
    type: 'showVariety',
    text: 'Show variety',
  },
];

class ProductForm extends FormComponent<FormInputs, PropsType> {
  state = {
    form: {
      name: '',
      desc: '',
      categoryId: -1,
      price: 0,
      currency: { id: '', label: '' },
      vendorCode: '',
      cashback: 5,
      quantity: 1,
      mainPhoto: null,
      additionalPhotos: [],
      attributes: [],
    },
    isSubmitting: false,
    validationErrors: {},
  };

  validators = {
    name: validators.notEmpty,
    desc: validators.notEmpty,
    price: validators.isPositiveNumber,
    vendorCode: validators.notEmpty,
    quantity: validators.isPositiveNumber,
    cashback: [[(val: mixed) => is(Number, val) && val >= 0 && val <= 100, '']],
    categoryId: validators.isPositiveNumber,
  };

  handlers = {
    name: assoc('name'),
    desc: assoc('desc'),
    categoryId: assoc('categoryId'),
    price: (value: number) => (form: FormInputs) => ({
      ...form,
      price: parseInt(value, 10) || 0,
    }),
    currency: assoc('currency'),
    vendorCode: assoc('vendorCode'),
    cashback: (value: number) => (form: FormInputs) => ({
      ...form,
      cashback: parseInt(value, 10) || 0,
    }),
    quantity: (value: number) => (form: FormInputs) => ({
      ...form,
      quantity: parseInt(value, 10) || 0,
    }),
    mainPhoto: assoc('mainPhoto'),
    additionalPhotos: assoc('additionalPhotos'),
    attributes: assoc('attributes'),
  };

  handle(input: $Keys<FormInputs>, value: *): void {
    if (this.state.isSubmitting) {
      return;
    }

    const handler = this.handlers[input](value);
    this.setState({
      form: handler(this.state.form),
      validationErrors: omit([input], this.state.validationErrors),
    });
  }

  // eslint-disable-next-line
  transformValidationErrors(serverValidationErrors: {
    [string]: Array<string>,
  }): { [$Keys<FormInputs>]: Array<string> } {
    return {};
  }

  renderAttributes = (): Node => null;

  runMutations = () =>
    createBaseProductMutation({
      environment: this.props.relay.environment,
      variables: {
        input: {
          clientMutationId: `${this.mutationId}`,
          name: [
            {
              lang: 'EN',
              text: this.state.form.name,
            },
          ],
          shortDescription: [
            {
              lang: 'EN',
              text: this.state.form.desc,
            },
          ],
          currency: 'STQ',
          categoryId: this.state.form.categoryId,
          storeId: (this.props.store && this.props.store.rawId) || -1,
        },
      },
    }).then(resp =>
      createProductMutation({
        environment: this.props.relay.environment,
        variables: {
          input: {
            clientMutationId: `${this.mutationId}`,
            attributes: [],
            product: {
              baseProductId: resp.createBaseProduct.rawId,
              photoMain: this.state.form.mainPhoto,
              additionalPhotos: this.state.form.additionalPhotos,
              vendorCode: this.state.form.vendorCode,
              cashback: this.state.form.cashback / 100,
              price: this.state.form.price,
            },
          },
        },
      }),
    );

  handleUpload = (e: SyntheticInputEvent<HTMLInputElement>) => {
    e.preventDefault();

    log.debug('handleUpload', e.currentTarget.files[0]);
  };

  handleSubmit = () => {
    this.submit(() => {
      log.debug('', 'created');
    });
  };

  render() {
    const isFormValid = isEmpty(this.validate());
    return (
      <div styleName="wrapper">
        <div styleName="formWrapper">
          <Container correct>
            <Row>
              <Col size={12}>
                <div styleName="centered">
                  <div styleName="headerTitle">Add new product</div>
                  <div styleName="headerDescription">
                    Choose what you gonna sale in your marketplace and add it
                    with ease
                  </div>
                </div>
              </Col>
              <Col size={12}>
                <div styleName="form">
                  <div styleName="section">
                    <div styleName="input">
                      <Input
                        id="name"
                        value={this.state.form.name}
                        label={
                          <span>
                            Product name <span styleName="red">*</span>
                          </span>
                        }
                        onChange={(e: { target: { value: string } }) => {
                          this.handle('name', e.target.value);
                        }}
                        fullWidth
                      />
                    </div>
                    <div styleName="input">
                      <Textarea
                        id="desc"
                        value={this.state.form.desc}
                        label={
                          <span>
                            Short description <span styleName="red">*</span>
                          </span>
                        }
                        onChange={(e: { target: { value: string } }) => {
                          this.handle('desc', e.target.value);
                        }}
                        fullWidth
                      />
                    </div>
                  </div>
                  <div styleName="section correctMargin">
                    <div styleName="sectionName">Product main photo</div>
                    <div styleName="uploadersWrapper">
                      <div styleName="uploadedPhotoList">
                        {(this.state.form.mainPhoto != null && (
                          <div
                            styleName="uploadItem"
                            onClick={() => {}}
                            onKeyDown={() => {}}
                            role="button"
                            tabIndex="0"
                          >
                            <div
                              styleName="imageBG"
                              style={{
                                backgroundImage: `url(${convertSrc(
                                  this.state.form.mainPhoto,
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
                                onUpload={this.handleUpload}
                                buttonHeight={10}
                                buttonWidth={10}
                                fullWidth
                                noIndents
                                buttonIconType="camera"
                                buttonIconSize={20}
                                buttonLabel="Add photo"
                                dataTest="productPhotosUploader"
                              />
                            </Col>
                            <Col size={12} mdVisible>
                              <UploadWrapper
                                id="upload_photo"
                                onUpload={this.handleUpload}
                                buttonHeight={10}
                                buttonWidth={10}
                                noIndents
                                buttonIconType="camera"
                                buttonIconSize={20}
                                buttonLabel="Add photo"
                                dataTest="productPhotosUploader"
                              />
                            </Col>
                          </Row>
                        )}
                      </div>
                    </div>
                  </div>
                  <div styleName="section">
                    <div styleName="sectionName">Product photo gallery</div>
                    <ProductsUploader
                      onRemove={() => {}}
                      onUpload={() => {}}
                      additionalPhotos={this.state.form.additionalPhotos}
                    />
                    <div styleName="uploadDescriptionContainer">
                      <div styleName="description">
                        * For better product appearance follow recomendations
                        below and upload appropriate photos:
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
                      General settings and pricing
                    </div>
                    <div styleName="categorySelector">
                      {this.props.rootCategory && (
                        <CategorySelector
                          rootCategory={this.props.rootCategory}
                          onSelect={(id: number) => {
                            this.handle('categoryId', id);
                          }}
                        />
                      )}
                    </div>
                    <div styleName="productStates formItem">
                      <Container correct>
                        <Row>
                          <Col size={12} md={6}>
                            <div styleName="formItem">
                              <Input
                                id="price"
                                value={
                                  this.state.form.price == null
                                    ? ''
                                    : `${this.state.form.price}`
                                }
                                label={
                                  <span>
                                    Price <span styleName="red">*</span>
                                  </span>
                                }
                                min="0"
                                onChange={(e: {
                                  target: { value: string },
                                }) => {
                                  this.handle('price', e.target.value);
                                }}
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
                                dataTest="wizard3rdStepCurrency"
                              />
                            </div>
                          </Col>
                          <Col size={12} md={6}>
                            <div styleName="formItem">
                              <Input
                                id="vendorCode"
                                value={
                                  this.state.form.vendorCode == null
                                    ? ''
                                    : `${this.state.form.vendorCode}`
                                }
                                label={
                                  <span>
                                    Vendor code <span styleName="red">*</span>
                                  </span>
                                }
                                onChange={(e: {
                                  target: { value: string },
                                }) => {
                                  this.handle('vendorCode', e.target.value);
                                }}
                                fullWidth
                              />
                            </div>
                          </Col>
                          <Col size={12} md={6}>
                            <div styleName="formItem">
                              <Input
                                id="cashback"
                                value={
                                  this.state.form.cashback == null
                                    ? ''
                                    : `${this.state.form.cashback}`
                                }
                                label="Cashback"
                                onChange={(e: {
                                  target: { value: string },
                                }) => {
                                  this.handle('cashback', e.target.value);
                                }}
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
                                  this.state.form.quantity == null
                                    ? '0'
                                    : `${this.state.form.quantity}`
                                }
                                label="Quantity"
                                onChange={(e: {
                                  target: { value: string },
                                }) => {
                                  this.handle('quantity', e.target.value);
                                }}
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
                  {this.state.form.categoryId > 0 && this.renderAttributes()}
                  <div styleName="buttons">
                    <div styleName="buttonContainer">
                      <Button
                        onClick={this.handleSubmit}
                        dataTest="wizardSaveProductButton"
                        big
                        disabled={!isFormValid}
                        fullWidth
                        load={this.state.isSubmitting}
                      >
                        <span>Save</span>
                      </Button>
                    </div>
                    <div styleName="buttonContainer">
                      <div
                        styleName="cancelButton"
                        onClick={() => {}}
                        onKeyDown={() => {}}
                        role="button"
                        tabIndex="0"
                      >
                        <span>Cancel</span>
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
  withShowAlert(ProductForm),
  graphql`
    fragment ProductForm_rootCategory on Category {
      id
      ...CategorySelector_rootCategory
    }

    fragment ProductForm_store on Store {
      id
      rawId
    }
  `,
);
