// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { createFragmentContainer, graphql } from 'react-relay';
import { assocPath, path, pick, pathOr, omit, where, complement } from 'ramda';
import debounce from 'lodash.debounce';
import { routerShape, withRouter } from 'found';

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
} from 'relay/mutations';
import { uploadFile } from 'utils';

import { resposeLogger, errorsLogger, transformTranslated } from './utils';
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
  currencyId: number,
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
  },
  attributes: Array<AttributeInputType>,
};

type PropsType = {
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
  baseProduct: BaseProductNodeType,
  isValid: boolean,
};

export const initialProductState = {
  baseProduct: {
    id: null,
    storeId: null,
    currencyId: 1,
    categoryId: null,
    name: '',
    shortDescription: '',
    product: {
      id: null,
      baseProductId: null,
      vendorCode: '',
      photoMain: '',
      additionalPhotos: [],
      price: null,
      cashback: null,
    },
    attributes: [],
  },
};

class WizardWrapper extends React.Component<PropsType, StateType> {
  static getDerivedStateFromProps(nextProps, prevState) {
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
      ...initialProductState,
      isValid: false,
    };
  }

  componentDidMount() {
    this.createWizard();
  }

  createWizard = () => {
    CreateWizardMutation.commit({
      environment: this.context.environment,
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
        resposeLogger(response, errors);
        if (!errors) {
          this.setState({ isValid: true });
        } else {
          this.setState({ isValid: false });
        }
      },
      onError: (error: Error) => {
        errorsLogger(error);
      },
    });
  };

  updateWizard = (data: {
    defaultLanguage?: string,
    addressFull?: { value: any },
  }) => {
    UpdateWizardMutation.commit({
      ...data,
      defaultLanguage: data.defaultLanguage ? data.defaultLanguage : 'EN',
      addressFull: data.addressFull ? data.addressFull : {},
      environment: this.context.environment,
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
        resposeLogger(response, errors);
        if (!errors) {
          this.setState({ isValid: true });
        } else {
          this.setState({ isValid: false });
        }
      },
      onError: (error: Error) => {
        errorsLogger(error);
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

  createStore = () => {
    const preparedData = this.prepareStoreMutationInput();
    CreateStoreMutation.commit({
      // $FlowIgnoreMe
      input: {
        clientMutationId: '',
        ...omit(['id'], preparedData),
      },
      environment: this.context.environment,
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
        if (!errors) {
          this.setState({ isValid: true });
        } else {
          this.setState({ isValid: false });
        }
        const storeId = pathOr(null, ['createStore', 'rawId'], response);
        this.updateWizard({ storeId });
        resposeLogger(response, errors);
      },
      onError: (error: Error) => {
        errorsLogger(error);
      },
    });
  };

  updateStore = () => {
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
        resposeLogger(response, errors);
        if (!errors) {
          this.setState({ isValid: true });
        } else {
          this.setState({ isValid: false });
        }
      },
      onError: (error: Error) => {
        errorsLogger(error);
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
    let errors = null;
    switch (step) {
      case 1:
        if (storeId) {
          this.updateStore();
          this.handleOnChangeStep(changedStep);
          break;
        }
        // eslint
        errors = this.createStore();
        if (!errors) {
          this.handleOnChangeStep(changedStep);
        }
        break;
      case 2:
        this.handleOnChangeStep(changedStep);
        this.updateStore();
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
      this.props.router.push(`/manage/store/${storeId}`);
      DeleteWizardMutation.commit({
        environment: this.context.environment,
        onCompleted: (response: ?Object, errors: ?Array<any>) => {
          this.handleOnClearProductState();
          resposeLogger(response, errors);
        },
        onError: (error: Error) => {
          errorsLogger(error);
        },
      });
    });
  };

  // delay for block tonns of query
  handleOnSaveWizard = debounce(data => {
    if (data) {
      this.updateWizard({
        ...omit(
          ['id', 'rawId', 'stepOne', 'stepTwo', 'stepThree', 'store'],
          data,
        ),
      });
    }
  }, 250);

  handleChangeForm = data => {
    this.handleOnSaveWizard(data);
  };

  // Product handlers
  createBaseProduct = () => {
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
    CreateBaseProductMutation.commit({
      ...preparedData,
      parentID,
      environment: this.context.environment,
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
        resposeLogger(response, errors);
        const baseProductId = pathOr(
          null,
          ['createBaseProduct', 'rawId'],
          response,
        );
        const baseProductID = pathOr(
          null,
          ['createBaseProduct', 'id'],
          response,
        );
        if (!baseProductId) {
          return;
        }
        // create variant after create base product
        const prepareDataForProduct = {
          product: {
            ...omit(['id'], baseProduct.product),
            cashback: (baseProduct.product.cashback || 0) / 100,
            baseProductId,
          },
          attributes: baseProduct.attributes,
        };
        CreateProductWithAttributesMutation.commit({
          input: {
            clientMutationId: '',
            ...prepareDataForProduct,
          },
          parentID: baseProductID,
          environment: this.context.environment,
          onCompleted: (
            productResponse: ?Object,
            productErrors: ?Array<any>,
          ) => {
            this.handleOnClearProductState();
            resposeLogger(productResponse, productErrors);
          },
          onError: (error: Error) => {
            errorsLogger(error);
          },
        });
      },
      onError: (error: Error) => {
        errorsLogger(error);
      },
    });
  };

  updateBaseProduct = () => {
    const { baseProduct } = this.state;
    const preparedData = transformTranslated(
      'EN',
      ['name', 'shortDescription'],
      omit(['product', 'attributes'], baseProduct),
    );
    UpdateBaseProductMutation.commit({
      ...preparedData,
      environment: this.context.environment,
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
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
        UpdateProductMutation.commit({
          input: {
            clientMutationId: '',
            ...prepareDataForProduct,
          },
          environment: this.context.environment,
          onCompleted: (
            productResponse: ?Object,
            productErrors: ?Array<any>,
          ) => {
            this.handleOnClearProductState();
            resposeLogger(productResponse, productErrors);
          },
          onError: (error: Error) => {
            errorsLogger(error);
          },
        });
        resposeLogger(response, errors);
      },
      onError: (error: Error) => {
        errorsLogger(error);
      },
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
        this.handleOnClearProductState();
        resposeLogger(response, errors);
      },
      onError: (error: Error) => {
        errorsLogger(error);
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
    if (!result.url) return;
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

  handleOnSaveProduct = () => {
    const { baseProduct } = this.state;
    if (baseProduct.id) {
      this.updateBaseProduct();
    } else {
      this.createBaseProduct();
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
          <div styleName="formWrapper firstForm">
            <div styleName="headerTitle">Give your store a name</div>
            <div styleName="headerDescription">
              Make a bright name for your store to attend your customers and
              encrease your sales
            </div>
            <Step1 initialData={wizardStore} onChange={this.handleChangeForm} />
          </div>
        );
      case 2:
        return (
          <div styleName="formWrapper secondForm">
            <div styleName="headerTitle">Set up store</div>
            <div styleName="headerDescription">
              Define a few settings that will make your sells effective and
              comfortable.
            </div>
            <Step2
              initialData={wizardStore}
              languages={this.props.languages}
              onChange={this.handleChangeForm}
            />
          </div>
        );
      case 3:
        return (
          <div styleName="formWrapper thirdForm">
            <div styleName="headerTitle">Fill your store with goods</div>
            <div styleName="headerDescription">
              Choose what you gonna sale in your marketplace and add it with
              ease
            </div>
            <Step3
              formStateData={this.state.baseProduct}
              products={baseProducts ? baseProducts.edges : []}
              onUpload={this.handleOnUploadPhoto}
              onChange={this.handleOnChangeProductForm}
              onClearProductState={this.handleOnClearProductState}
              onSave={this.handleOnSaveProduct}
              onDelete={this.handleOnDeleteProduct}
            />
          </div>
        );
      default:
        break;
    }
    return null;
  };

  render() {
    const { me } = this.props;
    const { step, showConfirm, isValid } = this.state;
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
        <div styleName="footerWrapper">
          <WizardFooter
            currentStep={step}
            onChangeStep={this.handleOnChangeStep}
            onSaveStep={this.handleOnSaveStep}
            isReadyToNext={isReadyToNext()}
          />
        </div>

        <Modal
          showModal={showConfirm}
          onClose={() => this.setState({ showConfirm: false })}
        >
          <div styleName="modalContent">
            <div styleName="modalTitle">
              Do you really want to leave this page?
            </div>
            <div styleName="modalButtonsContainer">
              <div styleName="modalOkButton">
                <Button
                  onClick={this.handleEndingWizard}
                  dataTest="closeWizard"
                  white
                  wireframe
                  big
                >
                  <span>Ok</span>
                </Button>
              </div>
              <Button
                onClick={() => this.setState({ showConfirm: false })}
                dataTest="continueWizard"
                big
              >
                <span>Cancel</span>
              </Button>
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

export default createFragmentContainer(
  withRouter(Page(WizardWrapper)),
  graphql`
    fragment Wizard_me on User {
      id
      rawId
      wizardStore {
        id
        rawId
        storeId
        name
        slug
        shortDescription
        defaultLanguage
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
                currencyId
                products(first: 1) @connection(key: "Wizard_products") {
                  edges {
                    node {
                      id
                      rawId
                      price
                      discount
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
);
