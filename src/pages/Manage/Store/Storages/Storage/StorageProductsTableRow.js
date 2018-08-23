// @flow
import React, { Component } from 'react';
import { isEmpty, map } from 'ramda';

import ImageLoader from 'libs/react-image-loader';
import { Input } from 'components/common/Input';
import { Button } from 'components/common/Button';

import { Checkbox } from 'components/common/Checkbox';
import { Icon } from 'components/Icon';
import BannerLoading from 'components/Banner/BannerLoading';
import { Col } from 'layout';

import { log, convertSrc, formatPrice } from 'utils';

import './StorageProductsTableRow.scss';

type PropsType = {
  item: {
    id: string,
    productId: number,
    quantity: number,
    photoMain: ?string,
    name: string,
    categoryName: string,
    price: string,
    attributes: Array<{
      attrId: number,
      attributeName: string,
      value: string,
    }>,
  },
  onSave: (number, string) => any,
};

type StateType = {
  storageFocusId: ?number,
  storageFocusCurrentValue: ?string,
  storageFocusValue: ?string,
};

class StorageProductsTableRow extends Component<PropsType, StateType> {
  state = {
    storageFocusId: null,
    storageFocusCurrentValue: null,
    storageFocusValue: null,
  };
  handleCheckboxClick = (id: string | number) => {
    log.info('id', id);
  };
  handleFocus = (e: any, quantity: number) => {
    const { id, value } = e.target;
    this.setState({
      storageFocusId: id,
      storageFocusCurrentValue: `${quantity}`,
      storageFocusValue: value,
    });
  };
  handleBlur = () => {
    const { storageFocusCurrentValue, storageFocusValue } = this.state;
    if (storageFocusValue === storageFocusCurrentValue) {
      this.setState({
        storageFocusId: null,
      });
    }
  };

  handleChange = (e: any) => {
    const { value } = e.target;

    if (value >= 0 && value !== '') {
      this.setState({
        storageFocusValue: value.replace(/^0+/, ''),
      });
    }
    if (value === '' || /^0+$/.test(value)) {
      this.setState({
        storageFocusValue: '0',
      });
    }
  };

  handleSave = (productId: number) => {
    const { onSave } = this.props;
    const { storageFocusValue } = this.state;
    // $FlowIgnoreMe
    onSave(productId, storageFocusValue);
    this.setState({
      storageFocusId: null,
    });
  };
  render() {
    const { item } = this.props;
    const { storageFocusId, storageFocusValue } = this.state;
    const thisProduct = `${item.productId}` === storageFocusId;
    return (
      <div styleName="container">
        <div styleName="td tdCheckbox">
          <Checkbox
            id={item.productId}
            onChange={() => this.handleCheckboxClick(item.productId)}
          />
        </div>
        <Col size={4} sm={4} md={2} lg={2} xl={1}>
          <div styleName="foto">
            {!item || !item.photoMain ? (
              <Icon type="camera" size="40" />
            ) : (
              <ImageLoader
                fit
                src={convertSrc(item.photoMain, 'small')}
                loader={<BannerLoading />}
              />
            )}
          </div>
        </Col>
        <Col size={4} sm={4} md={4} lg={3} xl={2}>
          <div styleName="name">
            <span>{item.name}</span>
          </div>
        </Col>
        <Col size={2} sm={2} md={2} lg={2} xl={2} xlVisible>
          <div>
            <span>{item.categoryName}</span>
          </div>
        </Col>
        <Col size={3} sm={3} md={3} lg={3} xl={2} mdVisible>
          {item &&
            item.price && <span>{`${formatPrice(item.price)} STQ`}</span>}
        </Col>
        <Col size={2} sm={2} md={2} lg={2} xl={2} xlVisible>
          {!isEmpty(item.attributes) && (
            <div>
              <div styleName="characteristicItem">
                <div styleName="characteristicLabels">
                  {map(
                    attributeItem => (
                      <div key={attributeItem.attrId}>
                        {`${attributeItem.attributeName}: `}
                      </div>
                    ),
                    item.attributes,
                  )}
                </div>
                <div styleName="characteristicValues">
                  {map(
                    attributeItem => (
                      <div key={attributeItem.attrId}>
                        {attributeItem.value}
                      </div>
                    ),
                    item.attributes,
                  )}
                </div>
              </div>
            </div>
          )}
        </Col>
        <Col size={3} sm={3} md={3} lg={3} xl={2} lgVisible>
          <div styleName="quantity">
            <Input
              id={item.productId}
              type="number"
              inline
              fullWidth
              value={thisProduct ? storageFocusValue : `${item.quantity}`}
              onFocus={(e: any) => {
                this.handleFocus(e, item.quantity);
              }}
              onBlur={this.handleBlur}
              onChange={this.handleChange}
              dataTest="storagesVariantQuantitiInput"
            />
            {thisProduct && (
              <Button
                small
                disabled={
                  thisProduct && storageFocusValue === `${item.quantity}`
                }
                onClick={() => {
                  this.handleSave(item.productId);
                }}
                dataTest="saveQuantityButton"
              >
                Save
              </Button>
            )}
          </div>
        </Col>
        <Col size={4} sm={4} md={3} lg={1} xl={1}>
          <div styleName="buttons">
            <button styleName="editButton">
              <Icon type="move" size={24} />
            </button>
          </div>
        </Col>
      </div>
    );
  }
}

export default StorageProductsTableRow;
