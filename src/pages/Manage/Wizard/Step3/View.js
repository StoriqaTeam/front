// @flow

import * as React from 'react';
import PropTypes from 'prop-types';
import { map, addIndex, assocPath, path, append } from 'ramda';

// import { Select } from 'components/common/Select';
// import { AddressForm } from 'components/AddressAutocomplete';
import { uploadFile, log } from 'utils';
import { Icon } from 'components/Icon';
// import { Modal } from 'components/Modal';
import { CardProduct } from 'components/CardProduct';

import Form from './Form';

import './View.scss';

type ModalType = {
  children: React.Element<*>,
  showModal: boolean,
  onClose: () => void,
};

type ProductNodeType = {
  node: {
    rawId: number,
    storeId: number,
    currencyId: number,
    name: Array<{
      lang: string,
      text: string,
    }>,
    discount: number,
    photoMain: string,
    cashback: number,
    price: number,
  },
};

type PropsType = {
  // data: {
  //   userId: ?number,
  //   storeId: ?number,
  //   name: ?string,
  //   slug: ?string,
  //   shortDescription: ?string,
  //   defaultLanguage: ?string,
  //   country: ?string,
  //   address: ?string,
  // },
  // onChange: (data: { [name: string]: string }) => void,
  products: {
    edges: Array<ProductNodeType>,
  },
};

type StateType = {
  showForm: boolean,
  baseProduct: {
    storeId: ?number,
    currencyId: number,
    categoryId: ?number,
    name: string,
    shortDescription: string,
    product: {
      baseProductId: ?number,
      vendorCode: ?string,
      photoMain: string,
      additionalPhotos: Array<string>,
      price: ?number,
      cashback: ?number,
    },
    attributes: [],
  },
};

const Modal = ({ children, showModal, onClose }: ModalType) => {
  if (!showModal) {
    return null;
  }
  return (
    <div styleName="modalWrapper">
      <div styleName="modal">
        <div styleName="modalContent">
          <div
            styleName="closeButton"
            role="button"
            onClick={onClose}
            onKeyDown={() => {}}
            tabIndex={0}
          >
            <Icon type="cross" />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
};

class ThirdStepView extends React.Component<PropsType, StateType> {
  state = {
    showForm: false,
    baseProduct: {
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
  };

  handleOnAddProduct = () => {
    log.info('handleOnAddProduct');
    this.setState({ showForm: true });
  };

  handleOnCloseModal = () => {
    this.setState({ showForm: false });
  };

  handleOnChangeForm = (data: { [string]: any }) => {
    log.info('^^^^ View handleOnChangeForm data : ', {
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

  handleOnUploadPhoto = async (e: any, type: ?string) => {
    if (!e) {
      return;
    }
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
      this.setState(prevState =>
        assocPath(
          ['baseProduct', 'product', 'photoMain'],
          // $FlowIgnoreMe
          append(result.url, additionalPhotos),
          prevState,
        ),
      );
    }
  };

  render() {
    // const { data, onChange, products, onUpload } = this.props;
    const { products } = this.props;
    const { baseProduct, showForm } = this.state;
    const productsArr = map(item => item.node, products.edges);
    const mapIndexed = addIndex(map);
    return (
      <div styleName="view">
        <div
          styleName="productItem uploaderItem"
          role="button"
          onClick={this.handleOnAddProduct}
          onKeyDown={() => {}}
          tabIndex={0}
        >
          <div styleName="productContent">
            <Icon type="cameraPlus" size={56} />
            <span styleName="buttonLabel">Add new product</span>
          </div>
        </div>
        {productsArr &&
          mapIndexed(
            (item, index) => (
              <div key={index} styleName="productItem cardItem">
                <div styleName="productContent">
                  <CardProduct item={item} />
                  <div styleName="layer">
                    <div
                      styleName="editbutton"
                      onClick={() => {}}
                      role="button"
                      onKeyDown={() => {}}
                      tabIndex={0}
                    >
                      <Icon type="note" size={56} />
                      <span styleName="buttonLabel">Edit product</span>
                    </div>
                    <div
                      styleName="editbutton"
                      onClick={() => {}}
                      role="button"
                      onKeyDown={() => {}}
                      tabIndex={0}
                    >
                      <Icon type="basket" size={56} />
                      <span styleName="buttonLabel">Delete product</span>
                    </div>
                  </div>
                </div>
              </div>
            ),
            productsArr,
          )}
        <Modal showModal={showForm} onClose={this.handleOnCloseModal}>
          <Form
            data={baseProduct}
            onChange={this.handleOnChangeForm}
            onUpload={this.handleOnUploadPhoto}
            categories={this.context.directories.categories}
          />
        </Modal>
      </div>
    );
  }
}

ThirdStepView.contextTypes = {
  directories: PropTypes.object.isRequired,
};

export default ThirdStepView;
