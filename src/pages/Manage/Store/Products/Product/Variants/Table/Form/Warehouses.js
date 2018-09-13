// @flow

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isEmpty, map, pathOr } from 'ramda';

import { withShowAlert } from 'components/App/AlertContext';
import { Input } from 'components/common/Input';
import { Button } from 'components/common/Button';
import { log, fromRelayError, addressToString } from 'utils';

import { SetProductQuantityInWarehouseMutation } from 'relay/mutations';
import type { MutationParamsType } from 'relay/mutations/SetProductQuantityInWarehouseMutation';
import type { AddAlertInputType } from 'components/App/AlertContext';

import './Warehouses.scss';

type AddressFullType = {|
  value: ?string,
  country: ?string,
  administrativeAreaLevel1: ?string,
  administrativeAreaLevel2: ?string,
  locality: ?string,
  political: ?string,
  postalCode: ?string,
  route: ?string,
  streetNumber: ?string,
  placeId: ?string,
|};

type PropsType = {
  stocks: Array<{
    id: string,
    productId: number,
    warehouseId: string,
    quantity: number,
    warehouse: {
      name: string,
      addressFull: AddressFullType,
    },
  }>,
  showAlert: (input: AddAlertInputType) => void,
};

type StateType = {
  storageFocusId: ?string,
  storageFocusCurrentValue: ?string,
  storageFocusValue: ?string,
};

class Warehouses extends Component<PropsType, StateType> {
  state = {
    storageFocusId: null,
    storageFocusCurrentValue: null,
    storageFocusValue: null,
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

  handleSave = (productId: number, warehouseId: string) => {
    const { storageFocusValue: quantity } = this.state;
    const { environment } = this.context;
    const params: MutationParamsType = {
      input: {
        clientMutationId: '',
        warehouseId,
        productId,
        quantity: parseInt(quantity, 10),
      },
      environment,
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
        log.debug({ response, errors });
        const relayErrors = fromRelayError({ source: { errors } });
        log.debug({ relayErrors });
        // $FlowIgnoreMe
        const statusError: string = pathOr({}, ['100', 'status'], relayErrors);
        if (!isEmpty(statusError)) {
          this.props.showAlert({
            type: 'danger',
            text: `Error: "${statusError}"`,
            link: { text: 'Close.' },
          });
          return;
        }
        if (errors) {
          this.props.showAlert({
            type: 'danger',
            text: 'Something going wrong :(',
            link: { text: 'Close.' },
          });
          return;
        }
        this.setState({
          storageFocusId: null,
        });
      },
      onError: (error: Error) => {
        log.debug({ error });
        this.props.showAlert({
          type: 'danger',
          text: 'Something going wrong :(',
          link: { text: 'Close.' },
        });
      },
    };
    SetProductQuantityInWarehouseMutation.commit(params);
  };

  render() {
    const { stocks } = this.props;
    const { storageFocusId, storageFocusValue } = this.state;
    return (
      <div styleName="container">
        <div styleName="title">
          <strong>Storages</strong>
        </div>
        <div styleName="items">
          {map(item => {
            const thisProduct = `${item.id}` === storageFocusId;
            const { addressFull } = item.warehouse;
            // $FlowIgnoreMe
            const warehouseName = pathOr(null, ['warehouse', 'name'], item);
            // $FlowIgnoreMe
            const warehouseSlug = pathOr(null, ['warehouse', 'slug'], item);
            return (
              <div key={item.id} styleName="item">
                <div styleName="td tdName">
                  <strong styleName="name">
                    {warehouseName || `Storage ${warehouseSlug}`}
                  </strong>
                </div>
                <div styleName="td tdAddress">
                  <div styleName="address">
                    {addressToString(addressFull) || 'No address'}
                  </div>
                </div>
                <div styleName="td tdQuantity">
                  <div styleName="quantityInput">
                    <Input
                      id={item.id}
                      type="number"
                      inline
                      fullWidth
                      value={
                        thisProduct
                          ? storageFocusValue || ''
                          : `${item.quantity}`
                      }
                      onFocus={(e: any) => {
                        this.handleFocus(e, item.quantity);
                      }}
                      onBlur={this.handleBlur}
                      onChange={this.handleChange}
                    />
                  </div>
                  {thisProduct && (
                    <div>
                      <Button
                        small
                        disabled={
                          thisProduct &&
                          storageFocusValue === `${item.quantity}`
                        }
                        onClick={() => {
                          this.handleSave(item.productId, item.warehouseId);
                        }}
                        dataTest="saveQuantityButton"
                      >
                        Save
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          }, stocks)}
        </div>
      </div>
    );
  }
}

Warehouses.contextTypes = {
  directories: PropTypes.object,
  environment: PropTypes.object.isRequired,
};

export default withShowAlert(Warehouses);
