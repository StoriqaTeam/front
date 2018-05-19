// @flow

import React from 'react';
import PropTypes from 'prop-types';
import { map, find } from 'ramda';

// import { Select } from 'components/common/Select';
// import { AddressForm } from 'components/AddressAutocomplete';
import { getNameText, uploadFile } from 'utils';
import { UploadWrapper } from 'components/Upload';
import { Icon } from 'components/Icon';
// import { Modal } from 'components/Modal';

import Form from './Form';

import './View.scss';

const Modal = ({ children, showModal, onClose }) => {
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

type PropsType = {
  data: {
    userId: ?number,
    storeId: ?number,
    name: ?string,
    slug: ?string,
    shortDescription: ?string,
    defaultLanguage: ?string,
    country: ?string,
    address: ?string,
  },
  onChange: (data: { [name: string]: string }) => void,
};

type StateType = {
  showForm: boolean,
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
    console.log('handleOnAddProduct');
    this.setState({ showForm: true });
  };

  handleOnCloseModal = () => {
    this.setState({ showForm: false });
  };

  handleOnChangeForm = form => {
    // console.log('^^^^ form : ', form);
    this.setState({
      baseProduct: {
        ...this.state.baseProduct,
        ...form,
      },
    });
  };

  handleOnUploadPhoto = async (e: any) => {
    e.preventDefault();
    const file = e.target.files[0];
    const result = await uploadFile(file);
    if (!result.url) return;
    console.log('result url: ', result.url);
  };

  render() {
    const { data, onChange, products, onUpload } = this.props;
    const { baseProduct, showForm } = this.state;
    return (
      <div styleName="view">
        <div
          styleName="productItem"
          role="button"
          onClick={this.handleOnAddProduct}
          onKeyDown={() => {}}
          tabIndex={0}
        >
          <div styleName="productContent">
            <Icon type="camera" size={32} />
            <span styleName="buttonLabel">add product</span>
          </div>
        </div>
        {products &&
          map(item => {
            return (
              <div styleName="productItem">
                <div styleName="productContent">
                  {getNameText(item.node.name)}
                </div>
              </div>
            );
          }, products)}
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
