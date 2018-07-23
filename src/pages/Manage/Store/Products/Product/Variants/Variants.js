// @flow

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { isEmpty, pathOr } from 'ramda';

import { log, fromRelayError } from 'utils';

import { DeactivateProductMutation } from 'relay/mutations';
import type { MutationParamsType } from 'relay/mutations/DeactivateProductMutation';
import type { AddAlertInputType } from 'components/App/AlertContext';

import Table from './Table/Table';

import './Variants.scss';

type PropsType = {
  productRawId: number,
  productId: string,
  category: {},
  variants: Array<{ rawId: number }>,
  storeID: string,
  showAlert: (input: AddAlertInputType) => void,
};

class Variants extends PureComponent<PropsType> {
  handleDeleteVariant = (id: string) => {
    const { environment } = this.context;
    const { productId } = this.props;
    if (!productId || !id) {
      this.props.showAlert({
        type: 'danger',
        text: 'Something going wrong :(',
        link: { text: 'Close.' },
      });
    }
    const params: MutationParamsType = {
      input: {
        clientMutationId: '',
        id,
      },
      parentID: productId,
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
        this.props.showAlert({
          type: 'success',
          text: 'Variant deleted!',
          link: { text: '' },
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
    DeactivateProductMutation.commit(params);
  };

  render() {
    return (
      <div styleName="container">
        <div styleName="title">
          <strong>Variants</strong>
        </div>
        <Table
          category={this.props.category}
          variants={this.props.variants}
          productRawId={this.props.productRawId}
          productId={this.props.productId}
          storeID={this.props.storeID}
          handleDeleteVariant={this.handleDeleteVariant}
        />
      </div>
    );
  }
}

Variants.contextTypes = {
  environment: PropTypes.object.isRequired,
  directories: PropTypes.object,
};

export default Variants;
