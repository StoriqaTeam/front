// @flow

import React from 'react';
import PropTypes from 'prop-types';
// import { ConnectionHandler } from 'relay-runtime';
import { createFragmentContainer, graphql } from 'react-relay';
import {
  //  append,
  assocPath,
  path,
  pick,
  evolve,
  pathOr,
  omit,
  where,
  complement,
} from 'ramda';
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
  // UpdateStoreMainMutation,
  CreateBaseProductMutation,
  UpdateBaseProductMutation,
  CreateProductWithAttributesMutation,
  // CreateProductMutation,
  // UpdateProductMutation,
  DeactivateBaseProductMutation,
} from 'relay/mutations';
import { uploadFile, log } from 'utils';

import { resposeLogger, errorsLogger, transformTranslated } from './utils';
import WizardHeader from './WizardHeader';
import WizardFooter from './WizardFooter';
import Step1 from './Step1/Form';
import Step2 from './Step2/Form';
import Step3 from './Step3/View';

import './Wizard.scss';

type BaseProductNodeType = {
  id: ?string,
  storeId: ?number,
  currencyId: number,
  categoryId: ?number,
  name: string,
  shortDescription: string,
  product: {
    baseProductId: ?number,
    vendorCode: string,
    photoMain: string,
    additionalPhotos: Array<string>,
    price: ?number,
    cashback: ?number,
  },
  attributes: Array<any>,
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
  isLoading: boolean,
  step: number,
  baseProduct: BaseProductNodeType,
  aditionalPhotosMap: {
    photoAngle: string,
    photoDetails: string,
    photoScene: string,
    photoUse: string,
    photoSizes: string,
    photoVarienty: string,
  },
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
      baseProductId: null,
      vendorCode: '',
      photoMain: '',
      additionalPhotos: [],
      price: null,
      cashback: null,
    },
    attributes: [],
  },
  aditionalPhotosMap: {
    photoAngle: '',
    photoDetails: '',
    photoScene: '',
    photoUse: '',
    photoSizes: '',
    photoVarienty: '',
  },
};

class WizardWrapper extends React.Component<PropsType, StateType> {
  static getDerivedStateFromProps(nextProps, prevState) {
    log.info('>>> getDerivedStateFromProps: ', { nextProps, prevState });
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
    // log.info('>>> constructor');
    this.state = {
      isLoading: false,
      showConfirm: false,
      step: 1,
      ...initialProductState,
    };
  }

  componentDidMount() {
    // log.info('>>> componentDidMount');
    this.createWizard();
  }

  createWizard = () => {
    log.info('>>> createWizard');
    this.setState(() => ({ isLoading: true }));
    CreateWizardMutation.commit({
      environment: this.context.environment,
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
        this.setState(() => ({ isLoading: false }));
        resposeLogger(response, errors);
      },
      onError: (error: Error) => {
        this.setState(() => ({ isLoading: false }));
        errorsLogger(error);
      },
    });
  };

  updateWizard = (data: {
    defaultLanguage?: string,
    addressFull?: { value: any },
  }) => {
    log.info('>>> updateWizard data: ', { data });
    this.setState(() => ({ isLoading: true }));
    UpdateWizardMutation.commit({
      ...data,
      defaultLanguage: data.defaultLanguage ? data.defaultLanguage : 'EN',
      addressFull: data.addressFull ? data.addressFull : {},
      environment: this.context.environment,
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
        log.info('^^^ updateWizard response, errors: ', {
          response,
          errors,
        });
        this.setState(() => ({ isLoading: false }));
        resposeLogger(response, errors);
      },
      onError: (error: Error) => {
        this.setState(() => ({ isLoading: false }));
        errorsLogger(error);
      },
    });
  };

  prepareStoreMutationInput = () => {
    // log.info('>>> prepareStoreMutationInput: ');
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
    const preparedData = evolve(
      {
        name: text => [{ lang: 'EN', text }],
        shortDescription: text => [{ lang: 'EN', text }],
      },
      {
        id,
        userId,
        address: wizardStore.addressFull.value,
        ...pick(
          ['name', 'shortDescription', 'defaultLanguage', 'slug'],
          wizardStore,
        ),
        ...omit(['value'], wizardStore.addressFull),
      },
    );
    log.info('<<< prepareStoreMutationInput: ', { preparedData });
    return preparedData;
  };

  createStore = () => {
    // log.info('>>> createStore');
    const preparedData = this.prepareStoreMutationInput();
    CreateStoreMutation.commit({
      ...preparedData,
      environment: this.context.environment,
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
        log.info('^^^ createStore response: ', { response, errors });
        const storeId = pathOr(null, ['createStore', 'rawId'], response);
        this.updateWizard({ storeId });
        this.setState(() => ({ isLoading: false }));
        resposeLogger(response, errors);
      },
      onError: (error: Error) => {
        this.setState(() => ({ isLoading: false }));
        errorsLogger(error);
      },
    });
  };

  updateStore = () => {
    // log.info('>>> updateStore');
    // const { step } = this.state;
    const preparedData = this.prepareStoreMutationInput();
    if (!preparedData.id) {
      return;
    }
    UpdateStoreMutation.commit({
      ...preparedData,
      environment: this.context.environment,
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
        log.info('^^^ updateStore updateStore mutation response: ', {
          response,
          errors,
        });
        this.setState(() => ({ isLoading: false }));
        resposeLogger(response, errors);
      },
      onError: (error: Error) => {
        this.setState(() => ({ isLoading: false }));
        errorsLogger(error);
      },
    });
  };

  handleOnChangeStep = (step: number) => {
    // log.info('>>> handleOnChangeStep: ', { step });
    this.setState({ step });
  };

  handleOnSaveStep = (changedStep: number) => {
    // log.info('>>> handleOnSaveStep: ', { changedStep });
    const { step } = this.state;
    // $FlowIgnoreMe
    const storeId = pathOr(null, ['me', 'wizardStore', 'storeId'], this.props);
    switch (step) {
      case 1:
        this.handleOnChangeStep(changedStep);
        if (storeId) {
          this.updateStore();
          break;
        }
        this.createStore();
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
    this.setState({ showConfirm: false }, () =>
      this.props.router.push(`/manage/store/${storeId}`),
    );
  };

  // delay for block tonns of query
  handleOnSaveWizard = debounce(data => {
    log.info('>>> handleOnSaveWizard: ', { data });
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
    // log.info('>>> handleChangeForm: ', { data });
    this.handleOnSaveWizard(data);
  };

  // Product handlers
  createBaseProduct = () => {
    // log.info('>>> createBaseProduct');
    const { baseProduct } = this.state;
    const preparedData = transformTranslated(
      'EN',
      ['name', 'shortDescription'],
      omit(['product', 'attributes'], baseProduct),
    );
    log.info('^^^ createBaseProduct preparedData: ', { preparedData });
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
        // log.info('^^^ createBaseProduct response: ', { response, errors });
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
          this.setState(() => ({ isLoading: false }));
          return;
        }
        // create variant after create base product
        const prepareDataForProduct = {
          product: {
            ...baseProduct.product,
            cashback: (baseProduct.product.cashback || 0) / 100,
            baseProductId,
          },
          attributes: baseProduct.attributes,
        };
        // log.info('^^^ createBaseProduct prepareDataForProduct: ', {
        //   prepareDataForProduct,
        // });
        CreateProductWithAttributesMutation.commit({
          ...prepareDataForProduct,
          parentID: baseProductID,
          environment: this.context.environment,
          onCompleted: (
            productResponse: ?Object,
            productErrors: ?Array<any>,
          ) => {
            this.setState(() => ({ isLoading: false }));
            this.handleOnClearProductState();
            resposeLogger(productResponse, productErrors);
          },
          onError: (error: Error) => {
            this.setState(() => ({ isLoading: false }));
            errorsLogger(error);
          },
        });
      },
      onError: (error: Error) => {
        this.setState(() => ({ isLoading: false }));
        errorsLogger(error);
      },
    });
  };

  updateBaseProduct = () => {
    log.info('>>> updateBaseProduct');
    const { baseProduct } = this.state;
    const preparedData = transformTranslated(
      'EN',
      ['name', 'shortDescription'],
      omit(['product', 'attributes'], baseProduct),
    );
    log.info('^^^ updateBaseProduct preparedData: ', { preparedData });
    UpdateBaseProductMutation.commit({
      ...preparedData,
      environment: this.context.environment,
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
        log.info('^^^ updateBaseProduct response: ', { response, errors });
        // const storeId = pathOr(null, ['createStore', 'rawId'], response);
        // this.updateWizard({ storeId });
        this.setState(() => ({ isLoading: false }));
        resposeLogger(response, errors);
      },
      onError: (error: Error) => {
        this.setState(() => ({ isLoading: false }));
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
        aditionalPhotosMap: initialProductState.aditionalPhotosMap,
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
    log.info('>>> handleOnChangeProductForm: ', {
      state: this.state,
      data,
    });
    this.setState({
      baseProduct: {
        ...this.state.baseProduct,
        ...data,
      },
    });
  };

  handleOnChangeAttrs = attrsValues => {
    log.info('>>> handleOnChangeAttrs values: ', { attrsValues });
    this.handleOnChangeProductForm({ attributes: attrsValues });
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
        aditionalPhotosMap: {
          ...this.state.aditionalPhotosMap,
          [type]: result.url,
        },
      }));
    }
  };

  handleOnSaveProduct = () => {
    log.info('>>> handleOnSaveProduct: ', { state: this.state.baseProduct });
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
    log.info('>>> renderForm', { baseProducts });
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
              aditionalPhotosMap={this.state.aditionalPhotosMap}
              onChange={this.handleOnChangeProductForm}
              onClearProductState={this.handleOnClearProductState}
              onChangeAttrs={this.handleOnChangeAttrs}
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
    log.info('>>> render props', this.props);
    log.info('>>> render state', this.state);
    log.info('>>> render context', this.context);
    log.info(this.state.isLoading);
    const { me } = this.props;
    const { step, showConfirm } = this.state;
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
    // debugger;
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
      log.info({ wizardStore });
      if (step === 1 && isStepOnePopulated) {
        return true;
      }
      if (step === 2 && isStepTwoPopulated) {
        return true;
      }
      if (step === 3 && isStepThreePopulated) {
        return true;
      }
      return false;
    };

    return (
      <div styleName="wizardContainer">
        <div styleName="stepperWrapper">
          <WizardHeader
            currentStep={step}
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
              Are you shure to end wizard and getting start selling?
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
        stepThree {
          edges {
            node {
              id
            }
          }
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
