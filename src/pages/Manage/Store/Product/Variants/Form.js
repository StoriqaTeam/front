// @flow

import React, { Component, Fragment } from 'react';

import { Button } from 'components/Button';
// import { Checkbox } from 'components/Forms';
import { Checkbox } from 'components/Checkbox';
import { Icon } from 'components/Icon';
import { log } from 'utils';

import Characteristics from './Characteristics';
import Foto from './Foto';

import './Form.scss';

type PropsType = {
  // id: string,
  vendorCode?: string,
  price?: number,
  cashback?: number,
  // characteristics?: Array<{}>,
  onSave: Function,
  // categoryId: number,
};

type StateType = {
  vendorCode: string,
  price: number,
  cashback: number,
  isOpenVariantData: boolean,
};

class Form extends Component<PropsType, StateType> {
  constructor(props: PropsType) {
    super(props);
    this.state = {
      vendorCode: props.vendorCode,
      price: props.price,
      cashback: props.cashback,
      isOpenVariantData: false,
    };
  }

  state: StateType = {
    //
  };

  handleSave = () => {
    const {
      vendorCode,
      price,
      cashback,
    } = this.state;
    this.props.onSave({
      vendorCode,
      price,
      cashback,
    });
  };

  handleCheckboxClick = () => this.setState(prevState => ({ checked: !prevState.checked }));

  handleVendorCodeChange = (e: any) => {
    this.setState({ vendorCode: e.target.value });
  };

  handlePriceChange = (e: any) => {
    const { target: { value } } = e;
    if (value === '') {
      this.setState({ price: null });
      return;
    } else if (Number.isNaN(parseFloat(value))) {
      return;
    }
    this.setState({ price: parseFloat(value) });
  };

  handleCashbackChange = (e: any) => {
    const { target: { value } } = e;
    if (value === '') {
      this.setState({ cashback: null });
      return;
    } else if (Number.isNaN(parseFloat(value))) {
      return;
    }
    this.setState({ cashback: parseFloat(value) });
  };

  toggleDropdownVariant = () => {
    this.setState({ isOpenVariantData: !this.state.isOpenVariantData });
  }

  renderHeader = () => (
    <div styleName="header">
      <div styleName="headerItem tdCheckbox">
        <Checkbox
          id="id-header"
          onChange={() => {}}
        />
      </div>
      <div styleName="headerItem tdDropdawn" />
      <div styleName="headerItem tdArticle">
        <div styleName="headerItemWrap">
          <span>Article</span>
          <Icon inline type="arrowExpand" />
        </div>
      </div>
      <div styleName="headerItem tdPrice">
        <div styleName="headerItemWrap">
          <span>Price</span>
          <Icon inline type="arrowExpand" />
        </div>
      </div>
      <div styleName="headerItem tdCashback">
        <div styleName="headerItemWrap">
          <span>Cashback</span>
          <Icon inline type="arrowExpand" />
        </div>
      </div>
      <div styleName="headerItem tdCharacteristics">
        <div styleName="headerItemWrap">
          <span>Characteristics</span>
          <Icon inline type="arrowExpand" />
        </div>
      </div>
      <div styleName="headerItem tdCount">
        <div styleName="headerItemWrap">
          <span>Count</span>
          <Icon inline type="arrowExpand" />
        </div>
      </div>
      <div styleName="headerItem tdBasket">
        <button>
          <Icon type="basket" />
        </button>
      </div>
    </div>
  )

  renderVariant = () => {
    const {
      vendorCode,
      price,
      cashback,
      isOpenVariantData,
    } = this.state;
    return (
      <div styleName="variant">
        <div styleName="variantItem tdCheckbox">
          <Checkbox
            id="id-variant"
            onChange={() => {}}
          />
        </div>
        <div styleName="variantItem tdDropdawn">
          <button onClick={this.toggleDropdownVariant}>
            <Icon inline type={isOpenVariantData ? 'openArrow' : 'closeArrow'} />
          </button>
        </div>
        <div styleName="variantItem tdArticle">
          <input
            styleName="input vendorCodeInput"
            type="text"
            onChange={this.handleVendorCodeChange}
            value={vendorCode || ''}
          />
        </div>
        <div styleName="variantItem tdPrice">
          <input
            styleName="input priceInput"
            type="text"
            onChange={this.handlePriceChange}
            value={price || ''}
          />
          <span styleName="inputPostfix">STQ</span>
        </div>
        <div styleName="variantItem tdCashback">
          <input
            styleName="input cashbackInput"
            type="text"
            onChange={this.handleCashbackChange}
            value={cashback || ''}
          />
          <span styleName="inputPostfix">%</span>
        </div>
        <div styleName="variantItem tdCharacteristics">Characteristics</div>
        <div styleName="variantItem tdCount">8</div>
        <div styleName="variantItem tdBasket">
          <button>
            <Icon type="basket" />
          </button>
        </div>
      </div>
    );
  }

  render() {
    const { isOpenVariantData } = this.state;
    return (
      <div>
        <div styleName="variants">
          {this.renderHeader()}
          {this.renderVariant()}
        </div>
        {isOpenVariantData &&
          <Fragment>
            <Characteristics
              onChange={values => log.debug('Form', { values })}
            />
            <Foto />
          </Fragment>
        }
        <Button
          type="button"
          onClick={this.handleSave}
        >
          Save
        </Button>
      </div>
    );
  }
}

export default Form;
