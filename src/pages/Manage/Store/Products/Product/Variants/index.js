// @flow

import React, { PureComponent } from 'react';
import { isEmpty, pathOr, map } from 'ramda';
import { Environment } from 'relay-runtime';

import { log, fromRelayError } from 'utils';
import { DeactivateProductMutation } from 'relay/mutations';

import type { AddAlertInputType } from 'components/App/AlertContext';
import type { ProductType } from 'pages/Manage/Store/Products/types';
import type { MutationParamsType } from 'relay/mutations/DeactivateProductMutation';

import Header from './Header';
import Row from './Row';

import './Variants.scss';

type PropsType = {
  variants: Array<ProductType>,
  productId: string,
  environment: Environment,
  onExpandClick: (id: number) => void,
  showAlert: (input: AddAlertInputType) => void,
};

class Variants extends PureComponent<PropsType> {
  handleDeleteVariant = (id: string) => {
    const { environment, productId } = this.props;
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

  expandClick = (id: number) => {
    this.props.onExpandClick(id);
  };

  render() {
    const { variants } = this.props;
    return (
      <div styleName="container">
        <Header onSelectAllClick={() => {}} />
        <div>
          {map(
            item => (
              <Row
                key={item.rawId}
                variant={item}
                handleDeleteVariant={this.handleDeleteVariant}
                onExpandClick={this.expandClick}
              />
            ),
            variants,
          )}
        </div>
      </div>
    );
  }
}

export default Variants;
