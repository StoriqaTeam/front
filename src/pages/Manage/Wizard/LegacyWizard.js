// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { createFragmentContainer, graphql } from 'react-relay';
import {
  assocPath,
  path,
  pick,
  pathOr,
  omit,
  where,
  complement,
  head,
  isEmpty,
} from 'ramda';
import debounce from 'lodash.debounce';
import { routerShape, withRouter } from 'found';

import { withShowAlert } from 'components/App/AlertContext';
import { Page } from 'components/App';
import { Modal } from 'components/Modal';
import { Button } from 'components/common/Button';
import {
  CreateWizardMutation,
  UpdateWizardMutation,
  CreateStoreMutation,
  UpdateStoreMutation,
  CreateBaseProductMutation,
  UpdateBaseProductMutation,
  CreateProductWithAttributesMutation,
  UpdateProductMutation,
  DeactivateBaseProductMutation,
  DeleteWizardMutation,
  CreateWarehouseMutation,
  SetProductQuantityInWarehouseMutation,
} from 'relay/mutations';
import { errorsHandler, log, fromRelayError, uploadFile } from 'utils';

import type { AddAlertInputType } from 'components/App/AlertContext';
import type { CreateBaseProductMutationResponseType } from 'relay/mutations/CreateBaseProductMutation';
import type { CreateProductWithAttributesMutationResponseType } from 'relay/mutations/CreateProductWithAttributesMutation';
import type { UpdateProductMutationResponseType } from 'relay/mutations/UpdateProductMutation';

import { transformTranslated } from './utils';
import WizardHeader from './WizardHeader';
import WizardFooter from './WizardFooter';
import Step1 from './Step1/Form';
import Step2 from './Step2/Form';
import Step3 from './Step3/View';

import './Wizard.scss';

type AttributeInputType = {
  attrId: number,
  value: ?string,
  metaField: ?string,
};

export type BaseProductNodeType = {
  id: ?string,
  storeId: ?number,
  currency: string,
  categoryId: ?number,
  name: string,
  shortDescription: string,
  product: {
    id: ?string,
    baseProductId: ?number,
    vendorCode: string,
    photoMain: string,
    additionalPhotos: Array<string>,
    price: ?number,
    cashback: ?number,
    quantity: ?number,
  },
  attributes: Array<AttributeInputType>,
};

type PropsType = {
  showAlert: (input: AddAlertInputType) => void,
  router: routerShape,
  languages: Array<{
    isoCode: string,
  }>,
  me: {
    wizardStore: {
      store: {
        baseProducts: {
          edges: Array<{
            node: BaseProductNodeType,
          }>,
        },
      },
    },
  },
};

type StateType = {
  showConfirm: boolean,
  step: number,
  editingProduct: boolean,
  baseProduct: BaseProductNodeType,
  isValid: boolean,
  validationErrors: ?{
    [string]: Array<string>,
  },
  isSavingInProgress: boolean,
};

export const initialProductState = {
  baseProduct: {
    id: null,
    storeId: null,
    currency: 'STQ',
    categoryId: null,
    name: '',
    shortDescription: '',
    product: {
      id: null,
      baseProductId: null,
      vendorCode: '',
      photoMain: '',
      additionalPhotos: [],
      price: 0,
      cashback: 5,
      quantity: 1,
    },
    attributes: [],
  },
};

class WizardWrapper extends React.Component<PropsType, StateType> {
  static getDerivedStateFromProps(nextProps: PropsType, prevState: StateType) {
    const wizardStore = pathOr(null, ['me', 'wizardStore'], nextProps);
    return {
      ...prevState,
      baseProduct: {
        ...prevState.baseProduct,
        storeId: wizardStore && wizardStore.storeId,
      },
    };
  }

  constructor(props: PropsType) {
    super(props);
    this.state = {
      showConfirm: false,
      step: 1,
      editingProduct: false,
      ...initialProductState,
      isValid: true,
      validationErrors: null,
      isSavingInProgress: false,
    };
  }

  componentDidMount() {
    this.createWizard();
  }

  handleSuccess = (text: ?string) => {
    this.setState({ isValid: true });
    if (text) {
      this.props.showAlert({
        text,
        type: 'success',
        link: { text: '' },
      });
    }
  };

  handleWizardError = (messages?: { [string]: Array<string> }) => {
    this.setState({
      isValid: false,
      validationErrors: messages || null,
    });
  };

  clearValidationErrors = () =>
    this.setState({
      isValid: true,
      validationErrors: null,
    });

  createWizard = () => {
    CreateWizardMutation.commit({
      environment: this.context.environment,
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
        log.debug({ response, errors });
        const relayErrors = fromRelayError({ source: { errors } });
        if (relayErrors) {
          // pass showAlert for show alert errors in common cases
          // pass handleCallback specify validation errors
          errorsHandler(
            relayErrors,
            this.props.showAlert,
            this.handleWizardError,
          );
        }
      },
      onError: (error: Error) => {
        log.debug({ error });
        const relayErrors = fromRelayError(error);
        errorsHandler(
          relayErrors,
          this.props.showAlert,
          this.handleWizardError,
        );
      },
    });
  };

  updateWizard = (
    data: {
      defaultLanguage?: string,
      addressFull?: { value: any },
      slug: ?string,
    },
    callback?: (isSuccess: boolean) => void,
  ) => {
    UpdateWizardMutation.commit({
      ...omit(['completed', 'slug'], data),
      slug: data.slug || null,
      defaultLanguage: data.defaultLanguage ? data.defaultLanguage : 'EN',
      addressFull: data.addressFull ? data.addressFull : {},
      environment: this.context.environment,
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
        log.debug({ response, errors });
        const relayErrors = fromRelayError({ source: { errors } });
        if (relayErrors) {
          // pass showAlert for show alert errors in common cases
          // pass handleCallback specify validation errors
          errorsHandler(
            relayErrors,
            this.props.showAlert,
            this.handleWizardError,
          );
          if (callback) {
            callback(false);
          }
          return;
        }
        this.clearValidationErrors();
        if (callback) {
          callback(true);
        }
      },
      onError: (error: Error) => {
        log.debug({ error });
        const relayErrors = fromRelayError(error);
        errorsHandler(
          relayErrors,
          this.props.showAlert,
          this.handleWizardError,
        );
        if (callback) {
          callback(true);
        }
      },
    });
  };

  prepareStoreMutationInput = () => {
    // $FlowIgnoreMe
    const wizardStore = pathOr(
      { addressFull: {} },
      ['me', 'wizardStore'],
      this.props,
    );
    // $FlowIgnoreMe
    const id = pathOr(null, ['me', 'wizardStore', 'store', 'id'], this.props);
    // $FlowIgnoreMe
    const userId = pathOr(null, ['me', 'rawId'], this.props);
    const preparedData = transformTranslated(
      'EN',
      ['name', 'shortDescription'],
      {
        id,
        userId,
        ...pick(
          ['name', 'shortDescription', 'defaultLanguage', 'slug'],
          wizardStore,
        ),
        addressFull: wizardStore.addressFull,
      },
    );
    return preparedData;
  };

  createStore = (callback: (success: boolean) => void) => {
    const preparedData = this.prepareStoreMutationInput();
    CreateStoreMutation.commit({
      // $FlowIgnoreMe
      input: {
        clientMutationId: '',
        ...omit(['id'], preparedData),
      },
      environment: this.context.environment,
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
        log.debug('CreateStoreMutation.commit', { response, errors });
        const relayErrors = fromRelayError({ source: { errors } });
        log.debug({ relayErrors });
        if (relayErrors) {
          errorsHandler(
            relayErrors,
            this.props.showAlert,
            this.handleWizardError,
          );
          callback(false);
          return;
        }

        const createStore = pathOr(null, ['createStore'], response);
        if (!createStore) {
          this.props.showAlert({
            type: 'danger',
            text: 'Unknown error',
            link: { text: 'Close.' },
          });
          callback(false);
          return;
        }

        this.clearValidationErrors();
        const storeId = pathOr(null, ['createStore', 'rawId'], response);
        this.updateWizard({ storeId, slug: null }, callback);
      },
      onError: (error: Error) => {
        log.debug('CreateStoreMutation.commit', { error });
        const relayErrors = fromRelayError(error);
        log.debug({ relayErrors });
        errorsHandler(
          relayErrors,
          this.props.showAlert,
          this.handleWizardError,
        );
        callback(false);
      },
    });
  };

  updateStore = (callback: (success: boolean) => void) => {
    const preparedData = this.prepareStoreMutationInput();
    if (!preparedData.id) {
      return;
    }
    UpdateStoreMutation.commit({
      // $FlowIgnoreMe
      input: {
        clientMutationId: '',
        ...omit(['userId'], preparedData),
      },
      environment: this.context.environment,
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
        log.debug({ response, errors });
        const relayErrors = fromRelayError({ source: { errors } });
        if (relayErrors) {
          errorsHandler(
            relayErrors,
            this.props.showAlert,
            this.handleWizardError,
          );
          callback(false);
          return;
        }

        // create storage if not exists
        const addressFull = pathOr(
          null,
          ['updateStore', 'addressFull'],
          response,
        );
        // $FlowIgnoreMe
        const warehouses = pathOr(
          null,
          ['me', 'wizardStore', 'store', 'warehouses'],
          this.props,
        );
        // $FlowIgnoreMe
        const storeId = pathOr(
          null,
          ['me', 'wizardStore', 'store', 'rawId'],
          this.props,
        );
        if ((!warehouses || isEmpty(warehouses)) && addressFull) {
          CreateWarehouseMutation.commit({
            input: {
              clientMutationId: '',
              storeId,
              addressFull,
            },
            environment: this.context.environment,
            onCompleted: (responze: ?Object, errorz: ?Array<any>) => {
              log.debug('CreateWarehouseMutation', { responze });
              const relayErrorz = fromRelayError({ source: { errorz } });
              if (relayErrors) {
                errorsHandler(
                  relayErrorz,
                  this.props.showAlert,
                  this.handleWizardError,
                );
                callback(false);
                return;
              }
              this.clearValidationErrors();
              callback(true);
            },
            onError: (error: Error) => {
              const relayErrorz = fromRelayError(error);
              errorsHandler(
                relayErrorz,
                this.props.showAlert,
                this.handleWizardError,
              );

              callback(false);
            },
          });
        } else {
          this.clearValidationErrors();
          callback(true);
        }
      },
      onError: (error: Error) => {
        log.debug({ error });
        const relayErrors = fromRelayError(error);
        errorsHandler(
          relayErrors,
          this.props.showAlert,
          this.handleWizardError,
        );
        callback(false);
      },
    });
  };

  handleOnChangeStep = (step: number) => {
    this.setState({ step });
  };

  handleOnSaveStep = (changedStep: number) => {
    const { step } = this.state;
    // $FlowIgnoreMe
    const storeId = pathOr(null, ['me', 'wizardStore', 'storeId'], this.props);
    this.setState({ isSavingInProgress: true });
    switch (step) {
      case 1:
        if (storeId) {
          this.updateStore((success: boolean) => {
            this.setState({ isSavingInProgress: false });
            if (success) {
              this.handleOnChangeStep(changedStep);
            }
          });
          break;
        }
        this.createStore((success: boolean) => {
          this.setState({ isSavingInProgress: false });
          if (success) {
            this.handleOnChangeStep(changedStep);
          }
        });
        break;
      case 2:
        this.updateStore((success: boolean) => {
          this.setState({ isSavingInProgress: false });
          if (success) {
            this.handleOnChangeStep(changedStep);
          }
        });
        break;
      case 3:
        this.setState({ showConfirm: true });
        break;
      default:
        break;
    }
  };

  handleEndingWizard = () => {
    // $FlowIgnoreMe
    const storeId = pathOr(null, ['me', 'wizardStore', 'storeId'], this.props);
    this.setState({ showConfirm: false }, () => {
      this.props.router.push(`/manage/store/${storeId}/products`);
      DeleteWizardMutation.commit({
        environment: this.context.environment,
        onCompleted: (response: ?Object, errors: ?Array<any>) => {
          log.debug({ response, errors });
          const relayErrors = fromRelayError({ source: { errors } });
          if (relayErrors) {
            errorsHandler(relayErrors, this.props.showAlert);
            return;
          }
          this.clearValidationErrors();
          this.handleOnClearProductState();
        },
        onError: (error: Error) => {
          log.debug({ error });
          const relayErrors = fromRelayError(error);
          errorsHandler(
            relayErrors,
            this.props.showAlert,
            this.handleWizardError,
          );
        },
      });
    });
  };

  // delay for block tonns of query
  handleOnSaveWizard = debounce(data => {
    if (data) {
      const addressFull = pathOr(null, ['addressFull'], data);
      this.updateWizard({
        ...omit(
          [
            'id',
            'rawId',
            'stepOne',
            'stepTwo',
            'stepThree',
            'store',
            'addressFull',
          ],
          data,
        ),
        addressFull: {
          ...pick(
            [
              'value',
              'country',
              'administrativeAreaLevel1',
              'administrativeAreaLevel2',
              'locality',
              'political',
              'postalCode',
              'route',
              'streetNumber',
              'placeId',
            ],
            addressFull,
          ),
        },
      });
    }
  }, 250);

  handleChangeForm = data => {
    this.handleOnSaveWizard(data);
  };

  handleOnChangeEditingProduct = (value: boolean) => {
    this.setState({ editingProduct: value });
  };

  // Product handlers
  createBaseProduct = (callback: () => void) => {
    const { baseProduct } = this.state;
    const preparedData = transformTranslated(
      'EN',
      ['name', 'shortDescription'],
      omit(['product', 'attributes'], baseProduct),
    );
    // $FlowIgnoreMe
    const parentID = pathOr(
      null,
      ['me', 'wizardStore', 'store', 'id'],
      this.props,
    );

    CreateBaseProductMutation.promise(
      {
        ...preparedData,
        parentID,
      },
      this.context.environment,
    )
      .then(
        (
          createBaseProductMutationResponse: CreateBaseProductMutationResponseType,
        ) => {
          // $FlowIgnoreMe
          const baseProductId = pathOr(
            null,
            ['createBaseProduct', 'rawId'],
            createBaseProductMutationResponse,
          );
          // $FlowIgnoreMe
          const baseProductID = pathOr(
            null,
            ['createBaseProduct', 'id'],
            createBaseProductMutationResponse,
          );
          if (!baseProductId || !baseProductID) {
            throw new Error("Can't create variant without base product id");
          }
          this.clearValidationErrors();
          // create variant after create base product
          const prepareDataForProduct = {
            product: {
              ...omit(['id', 'quantity'], baseProduct.product),
              cashback: (baseProduct.product.cashback || 0) / 100,
              baseProductId,
            },
            attributes: baseProduct.attributes,
          };

          return CreateProductWithAttributesMutation.promise(
            {
              input: {
                clientMutationId: '',
                ...prepareDataForProduct,
              },
              parentID: baseProductID,
            },
            this.context.environment,
          );
        },
      )
      .then((response: CreateProductWithAttributesMutationResponseType) => {
        log.debug({ response });
        // $FlowIgnoreMe
        const warehouseId = pathOr(
          null,
          ['createProduct', 'baseProduct', 'store', 'warehouses', 0, 'id'],
          response,
        );
        // $FlowIgnoreMe
        const productId = pathOr(null, ['createProduct', 'rawId'], response);

        return SetProductQuantityInWarehouseMutation.promise(
          {
            input: {
              clientMutationId: '',
              warehouseId,
              productId,
              quantity: this.state.baseProduct.product.quantity,
            },
          },
          this.context.environment,
        );
      })
      .then(() => {
        this.clearValidationErrors();
        this.handleOnClearProductState();
        callback();
      })
      .catch((errors: Array<any>) => {
        const relayErrors = fromRelayError({ source: { errors } });
        if (relayErrors && !isEmpty(relayErrors)) {
          errorsHandler(
            relayErrors,
            this.props.showAlert,
            this.handleWizardError,
          );
        } else {
          this.props.showAlert({
            type: 'danger',
            // $FlowIgnoreMe
            text: `Error: ${pathOr(
              'Unknown error',
              ['message'],
              head(errors),
            )}`,
            link: { text: 'Close.' },
          });
        }
      });
  };

  updateBaseProduct = (callback: () => void) => {
    const { baseProduct } = this.state;
    const preparedData = transformTranslated(
      'EN',
      ['name', 'shortDescription'],
      omit(['product', 'attributes'], baseProduct),
    );

    UpdateBaseProductMutation.promise(
      {
        ...preparedData,
      },
      this.context.environment,
    )
      .then(() => {
        const prepareDataForProduct = {
          id: baseProduct.product.id,
          product: {
            ...pick(
              ['photoMain', 'additionalPhotos', 'vendorCode', 'price'],
              // $FlowIgnoreMe
              baseProduct.product,
            ),
            cashback: (baseProduct.product.cashback || 0) / 100,
          },
          attributes: baseProduct.attributes,
        };

        const input = {
          input: { ...prepareDataForProduct, clientMutationId: '' },
        };
        return UpdateProductMutation.promise(input, this.context.environment);
      })
      .then(
        (updateProductMutationResponse: UpdateProductMutationResponseType) => {
          // $FlowIgnoreMe
          const warehouseId = pathOr(
            null,
            ['updateProduct', 'baseProduct', 'store', 'warehouses', 0, 'id'],
            updateProductMutationResponse,
          );
          // $FlowIgnoreMe
          const productId = pathOr(
            null,
            ['updateProduct', 'rawId'],
            updateProductMutationResponse,
          );

          return SetProductQuantityInWarehouseMutation.promise(
            {
              input: {
                clientMutationId: '',
                warehouseId,
                productId,
                quantity: this.state.baseProduct.product.quantity,
              },
            },
            this.context.environment,
          );
        },
      )
      .then(() => {
        this.clearValidationErrors();
        this.handleOnClearProductState();
        this.props.showAlert({
          type: 'success',
          text: 'Product updated!',
          link: { text: 'Close.' },
        });
        callback();
      })
      .catch((errors: Array<any>) => {
        const relayErrors = fromRelayError({ source: { errors } });
        if (relayErrors && !isEmpty(relayErrors)) {
          errorsHandler(
            relayErrors,
            this.props.showAlert,
            this.handleWizardError,
          );
        } else {
          this.props.showAlert({
            type: 'danger',
            // $FlowIgnoreMe
            text: `Error: ${pathOr(
              'Unknown error',
              ['message'],
              head(errors),
            )}`,
            link: { text: 'Close.' },
          });
        }
      });
  };

  handleOnClearProductState = () => {
    this.setState(prevState => {
      // storeId save for next products
      const clearedData = omit(['storeId'], initialProductState.baseProduct);
      return {
        ...prevState,
        baseProduct: {
          ...prevState.baseProduct,
          ...clearedData,
        },
      };
    });
  };

  handleOnDeleteProduct = (ID: string) => {
    const storeID = path(['me', 'wizardStore', 'store', 'id'], this.props);
    DeactivateBaseProductMutation.commit({
      id: ID,
      parentID: storeID,
      environment: this.context.environment,
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
        log.debug({ response, errors });
        const relayErrors = fromRelayError({ source: { errors } });
        if (relayErrors) {
          errorsHandler(
            relayErrors,
            this.props.showAlert,
            this.handleWizardError,
          );
          return;
        }
        this.clearValidationErrors();
        this.handleOnClearProductState();
      },
      onError: (error: Error) => {
        log.debug({ error });
        const relayErrors = fromRelayError(error);
        errorsHandler(
          relayErrors,
          this.props.showAlert,
          this.handleWizardError,
        );
      },
    });
  };

  handleOnChangeProductForm = data => {
    this.setState({
      baseProduct: {
        ...this.state.baseProduct,
        ...data,
      },
    });
  };

  handleOnUploadPhoto = async (type: string, e: any) => {
    e.preventDefault();
    const file = e.target.files[0];
    const result = await uploadFile(file);
    if (!result.url) {
      this.props.showAlert({
        text: "Can't upload photo",
        type: 'success',
        link: { text: '' },
      });
      return;
    }
    if (type === 'photoMain') {
      this.setState(prevState =>
        assocPath(
          ['baseProduct', 'product', 'photoMain'],
          result.url,
          prevState,
        ),
      );
    } else {
      const additionalPhotos =
        path(['baseProduct', 'product', 'additionalPhotos'], this.state) || [];
      this.setState(prevState => ({
        ...prevState,
        baseProduct: {
          ...prevState.baseProduct,
          product: {
            ...prevState.baseProduct.product,
            additionalPhotos: [...additionalPhotos, result.url || ''],
          },
        },
      }));
    }
  };

  handleOnSaveProduct = (callback: () => void) => {
    const { baseProduct } = this.state;
    if (baseProduct.id) {
      this.updateBaseProduct(callback);
    } else {
      this.createBaseProduct(callback);
    }
  };

  renderForm = () => {
    const { step } = this.state;
    // $FlowIgnoreMe
    const wizardStore = pathOr(null, ['me', 'wizardStore'], this.props);
    // $FlowIgnoreMe
    const baseProducts = pathOr(
      null,
      ['me', 'wizardStore', 'store', 'baseProducts'],
      this.props,
    );
    switch (step) {
      case 1:
        return (
          <Step1
            initialData={wizardStore}
            onChange={this.handleChangeForm}
            errors={this.state.validationErrors}
          />
        );
      case 2:
        return (
          <Step2
            initialData={wizardStore}
            languages={this.props.languages}
            onChange={this.handleChangeForm}
          />
        );
      case 3:
        return (
          <Step3
            formStateData={this.state.baseProduct}
            products={baseProducts ? baseProducts.edges : []}
            onUpload={this.handleOnUploadPhoto}
            onChange={this.handleOnChangeProductForm}
            onClearProductState={this.handleOnClearProductState}
            onSave={this.handleOnSaveProduct}
            onDelete={this.handleOnDeleteProduct}
            errors={this.state.validationErrors}
            onChangeEditingProduct={this.handleOnChangeEditingProduct}
          />
        );
      default:
        break;
    }
    return null;
  };

  render() {
    const { me } = this.props;
    const {
      step,
      showConfirm,
      isValid,
      editingProduct,
      isSavingInProgress,
    } = this.state;
    const { wizardStore } = me;
    // $FlowIgnoreMe
    const baseProducts = pathOr(
      null,
      ['me', 'wizardStore', 'store', 'baseProducts'],
      this.props,
    );
    const isNotEmpty = complement((i: any) => !i);
    const stepOneChecker = where({
      name: isNotEmpty,
      slug: isNotEmpty,
      shortDescription: isNotEmpty,
    });
    const steptTwoChecker = where({
      defaultLanguage: isNotEmpty,
    });
    const isReadyToNext = () => {
      if (!wizardStore) {
        return false;
      }
      const stepOne = pick(['name', 'shortDescription', 'slug'], wizardStore);
      const isStepOnePopulated = stepOneChecker(stepOne);
      const stepTwo = pick(['defaultLanguage'], wizardStore);
      const isStepTwoPopulated = steptTwoChecker(stepTwo);
      const isStepThreePopulated =
        baseProducts && baseProducts.edges.length > 0;
      if (step === 1 && isStepOnePopulated && isValid) {
        return true;
      }
      if (step === 2 && isStepTwoPopulated && isValid) {
        return true;
      }
      if (step === 3 && isStepThreePopulated && isValid) {
        return true;
      }
      return false;
    };
    // $FlowIgnoreMe
    const storeId = pathOr(null, ['me', 'wizardStore', 'storeId'], this.props);
    const isReadyChangeStep = () => {
      if (step === 1 && isReadyToNext() && storeId) {
        return true;
      }
      if (step === 2 && isReadyToNext()) {
        return true;
      }
      return false;
    };

    return (
      <div styleName="wizardContainer">
        <div styleName="stepperWrapper">
          <WizardHeader
            currentStep={step}
            isReadyToNext={isReadyChangeStep()}
            onChangeStep={this.handleOnChangeStep}
          />
        </div>
        <div styleName="contentWrapper">{this.renderForm()}</div>
        {!editingProduct && (
          <div styleName="footerWrapper">
            <WizardFooter
              currentStep={step}
              onChangeStep={this.handleOnChangeStep}
              onSaveStep={this.handleOnSaveStep}
              isReadyToNext={isReadyToNext()}
              isSavingInProgress={isSavingInProgress}
            />
          </div>
        )}
        <Modal
          showModal={showConfirm}
          onClose={() => this.setState({ showConfirm: false })}
        >
          <div styleName="endingWrapper">
            <div styleName="endingContent">
              <div styleName="title">
                Do you really want to leave this page?
              </div>
              <div styleName="buttonsContainer">
                <Button
                  onClick={() => this.setState({ showConfirm: false })}
                  dataTest="continueWizard"
                  wireframe
                  big
                >
                  <span>Cancel</span>
                </Button>
                <div styleName="secondButton">
                  <Button
                    onClick={this.handleEndingWizard}
                    dataTest="closeWizard"
                    big
                  >
                    <span>Publish my store</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

WizardWrapper.contextTypes = {
  environment: PropTypes.object.isRequired,
};

export default WizardWrapper;

/* export default createFragmentContainer(
  withRouter(Page(withShowAlert(WizardWrapper), true, true)),
  graphql`
    fragment Wizard_me on User {
      id
      rawId
      myStore {
        rawId
      }
      wizardStore {
        id
        rawId
        storeId
        name
        slug
        shortDescription
        defaultLanguage
        completed
        addressFull {
          country
          value
          administrativeAreaLevel1
          administrativeAreaLevel2
          locality
          political
          postalCode
          route
          streetNumber
        }
        store {
          id
          rawId
          warehouses {
            id
          }
          baseProducts(first: 100) @connection(key: "Wizard_baseProducts") {
            edges {
              node {
                id
                rawId
                name {
                  text
                  lang
                }
                shortDescription {
                  lang
                  text
                }
                category {
                  id
                  rawId
                }
                storeId
                currency
                products(first: 1) @connection(key: "Wizard_products") {
                  edges {
                    node {
                      id
                      rawId
                      price
                      discount
                      quantity
                      photoMain
                      additionalPhotos
                      vendorCode
                      cashback
                      price
                      attributes {
                        attrId
                        value
                        metaField
                        attribute {
                          id
                          rawId
                          name {
                            lang
                            text
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
              }
            }
          }
        }
      }
    }
  `,
); */
