// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { ConnectionHandler } from 'relay-runtime';
import { createFragmentContainer, graphql } from 'react-relay';
import {
  append,
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

import { Page } from 'components/App';
import {
  CreateWizardMutation,
  UpdateWizardMutation,
  CreateStoreMutation,
  UpdateStoreMutation,
  // UpdateStoreMainMutation,
  CreateBaseProductMutation,
  UpdateBaseProductMutation,
  CreateProductWithAttributesMutation,
  UpdateProductMutation,
  CreateProductMutation,
} from 'relay/mutations';
import { uploadFile } from 'utils';

import { resposeLogger, errorsLogger, transformTranslated } from './utils';
import WizardHeader from './WizardHeader';
import WizardFooter from './WizardFooter';
import Step1 from './Step1/Form';
import Step2 from './Step2/Form';
import Step3 from './Step3/View';

import './Wizard.scss';

type PropsType = {};

type StateType = {};

class WizardWrapper extends React.Component<PropsType, StateType> {
  static getDerivedStateFromProps(nextProps, prevState) {
    console.log('>>> getDerivedStateFromProps: ', { nextProps, prevState });
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
    // console.log('>>> constructor');
    this.state = {
      step: 1,
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
  }

  componentDidMount() {
    // console.log('>>> componentDidMount');
    this.createWizard();
  }

  createWizard = () => {
    console.log('>>> createWizard');
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

  updateWizard = data => {
    console.log('>>> updateWizard data: ', { data });
    this.setState(() => ({ isLoading: true }));
    UpdateWizardMutation.commit({
      ...data,
      defaultLanguage: data.defaultLanguage ? data.defaultLanguage : 'EN',
      addressFull: data.addressFull ? data.addressFull : {},
      environment: this.context.environment,
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
        console.log('^^^ updateWizard response, errors: ', {
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
    // console.log('>>> prepareStoreMutationInput: ');
    const wizardStore = pathOr(null, ['me', 'wizardStore'], this.props);
    const id = pathOr(null, ['me', 'wizardStore', 'store', 'id'], this.props);
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
    console.log('<<< prepareStoreMutationInput: ', { preparedData });
    return preparedData;
  };

  createStore = () => {
    // console.log('>>> createStore');
    const preparedData = this.prepareStoreMutationInput();
    CreateStoreMutation.commit({
      ...preparedData,
      environment: this.context.environment,
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
        console.log('^^^ createStore response: ', { response, errors });
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
    // console.log('>>> updateStore');
    const { step } = this.state;
    const preparedData = this.prepareStoreMutationInput();
    if (!preparedData.id) {
      return;
    }
    // const updater = step === 1 ? UpdateStoreMainMutation : UpdateStoreWizardMutation;
    UpdateStoreMutation.commit({
      ...preparedData,
      environment: this.context.environment,
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
        console.log('^^^ updateStore updateStore mutation response: ', {
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
    // console.log('>>> handleOnChangeStep: ', { step });
    this.setState({ step });
  };

  handleOnSaveStep = (changedStep: number) => {
    // console.log('>>> handleOnSaveStep: ', { changedStep });
    const { step } = this.state;
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
        this.updateStore();
        break;
      default:
        break;
    }
  };

  // delay for block tonns of query
  handleOnSaveWizard = debounce(data => {
    console.log('>>> handleOnSaveWizard: ', { data });
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
    // console.log('>>> handleChangeForm: ', { data });
    this.handleOnSaveWizard(data);
  };

  // Product handlers
  createBaseProduct = () => {
    // console.log('>>> createBaseProduct');
    const { baseProduct } = this.state;
    const preparedData = transformTranslated(
      'EN',
      ['name', 'shortDescription'],
      omit(['product', 'attributes'], baseProduct),
    );
    console.log('^^^ createBaseProduct preparedData: ', { preparedData });
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
        // console.log('^^^ createBaseProduct response: ', { response, errors });
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
            cashback: baseProduct.product.cashback / 100,
            baseProductId,
          },
          attributes: baseProduct.attributes,
        };
        // console.log('^^^ createBaseProduct prepareDataForProduct: ', {
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
            console.log('^^^ createProduct response: ', {
              productResponse,
              productErrors,
            });
            this.setState(() => ({ isLoading: false }));
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
    console.log('>>> updateBaseProduct');
    const { baseProduct } = this.state;
    const preparedData = transformTranslated(
      'EN',
      ['name', 'shortDescription'],
      omit(['product', 'attributes'], baseProduct),
    );
    console.log('^^^ updateBaseProduct preparedData: ', { preparedData });
    UpdateBaseProductMutation.commit({
      ...preparedData,
      environment: this.context.environment,
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
        console.log('^^^ updateBaseProduct response: ', { response, errors });
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

  handleOnChangeProductForm = data => {
    console.log('>>> handleOnChangeProductForm: ', {
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
      const additionalPhotos = path(
        ['baseProduct', 'product', 'additionalPhotos'],
        this.state,
      );
      this.setState(prevState => ({
        ...prevState,
        baseProduct: {
          ...prevState.baseProduct,
          product: {
            ...prevState.baseProduct.product,
            additionalPhotos: [...additionalPhotos, result.url],
          },
        },
        aditionalPhotosMap: {
          ...this.state.aditionalPhotosMap,
          [type]: result.url,
        },
      }));
    }
  };

  handleOnChangeAttrs = attrsValues => {
    console.log('>>> handleOnChangeAttrs values: ', { attrsValues });
  };

  handleOnSaveProduct = () => {
    console.log('>>> handleOnSaveProduct: ', { state: this.state.baseProduct });
    const { baseProduct } = this.state;
    if (baseProduct.id) {
      this.updateBaseProduct();
    } else {
      this.createBaseProduct();
    }
  };

  renderForm = () => {
    const { step } = this.state;
    const wizardStore = pathOr(null, ['me', 'wizardStore'], this.props);
    const baseProducts = pathOr(
      null,
      ['me', 'wizardStore', 'store', 'baseProducts'],
      this.props,
    );
    console.log('>>> renderForm', { baseProducts });
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
              onChangeAttrs={this.handleOnChangeAttrs}
              onSave={this.handleOnSaveProduct}
            />
          </div>
        );
      default:
        break;
    }
    return null;
  };

  render() {
    console.log('>>> render', { props: this.props });
    console.log('>>> render context', this.context);
    const { step } = this.state;
    const wizardStore = pathOr(null, ['me', 'wizardStore'], this.props);
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
      if (step === 1 && isStepOnePopulated) {
        return true;
      }
      if (step === 2 && isStepTwoPopulated) {
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
      </div>
    );
  }
}

WizardWrapper.contextTypes = {
  environment: PropTypes.object.isRequired,
};

export default createFragmentContainer(
  Page(WizardWrapper),
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
