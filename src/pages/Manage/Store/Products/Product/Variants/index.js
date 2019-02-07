// @flow

import React, { Component } from 'react';
import { isEmpty, pathOr, map } from 'ramda';
import { Environment } from 'relay-runtime';
import uuidv4 from 'uuid/v4';

import { log, fromRelayError } from 'utils';
import { DeactivateProductMutation } from 'relay/mutations';
import { Confirmation } from 'components/Confirmation';

import type { AddAlertInputType } from 'components/Alerts/AlertContext';
import type { ProductType } from 'pages/Manage/Store/Products/types';
import type { MutationParamsType } from 'relay/mutations/DeactivateProductMutation';
import type { SelectItemType } from 'types';

import Header from './Header';
import Row from './Row';

import './Variants.scss';

import t from './i18n';

type PropsType = {
  currency: SelectItemType,
  variants: Array<ProductType>,
  productId: string,
  environment: Environment,
  onExpandClick: (id: number) => void,
  showAlert: (input: AddAlertInputType) => void,
  onCopyVariant: (variant: ProductType) => void,
};

type StateType = {
  showModal: boolean,
  dataToDelete: ?string,
};

class Variants extends Component<PropsType, StateType> {
  state = {
    showModal: false,
    dataToDelete: null,
  };

  deleteVariant = (id: string) => {
    const { environment, productId } = this.props;
    if (!productId || !id) {
      this.props.showAlert({
        type: 'danger',
        text: t.somethingWentWrong,
        link: { text: t.close },
      });
    }
    const params: MutationParamsType = {
      input: {
        clientMutationId: uuidv4(),
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
            text: `${t.error} "${statusError}"`,
            link: { text: t.close },
          });
          return;
        }
        this.handleCloseModal();
        this.props.showAlert({
          type: 'success',
          text: t.variantDeleted,
          link: { text: '' },
        });
      },
      onError: (error: Error) => {
        log.debug({ error });
        this.props.showAlert({
          type: 'danger',
          text: t.somethingWentWrong,
          link: { text: t.close },
        });
      },
    };
    DeactivateProductMutation.commit(params);
  };

  expandClick = (id: number): void => {
    this.props.onExpandClick(id);
  };

  handleDelete = (): void => {
    const { dataToDelete } = this.state;
    // $FlowIgnoreMe
    this.deleteVariant(dataToDelete);
  };

  handleDeleteModal = (id: string): void => {
    this.setState({ showModal: true, dataToDelete: id });
  };

  handleCloseModal = (): void => {
    this.setState({ showModal: false, dataToDelete: null });
  };

  render() {
    const { variants, onCopyVariant, currency } = this.props;
    const { showModal } = this.state;
    return (
      <div styleName="container">
        <Header onSelectAllClick={() => {}} />
        <div>
          {map(
            item => (
              <Row
                key={item.rawId}
                variant={item}
                currency={currency}
                handleDeleteVariant={this.handleDeleteModal}
                onExpandClick={this.expandClick}
                onCopyVariant={onCopyVariant}
              />
            ),
            variants,
          )}
        </div>
        <Confirmation
          showModal={showModal}
          onClose={this.handleCloseModal}
          title={t.deleteVariant}
          description={t.confirmationDescription}
          onCancel={this.handleCloseModal}
          onConfirm={this.handleDelete}
          confirmText={t.confirmText}
          cancelText={t.cancelText}
        />
      </div>
    );
  }
}

export default Variants;
