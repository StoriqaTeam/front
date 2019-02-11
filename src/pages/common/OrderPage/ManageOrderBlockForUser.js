// @flow

import React, { Component, Fragment } from 'react';
import { Environment } from 'relay-runtime';
import uuidv4 from 'uuid/v4';
import { isNil, pathOr } from 'ramda';

import { withShowAlert } from 'components/Alerts/AlertContext';
import { Modal } from 'components/Modal';
import { Button, Textarea } from 'components/common';
import {
  SetOrderStatusCompleteMutation,
  CreateDisputeMutation,
} from 'relay/mutations';
import { Confirmation } from 'components/Confirmation';

import type { AddAlertInputType } from 'components/Alerts/AlertContext';
import type {
  MutationParamsType as SetOrderStatusCompleteMutationParamsType,
  SetOrderStatusCompleteMutationResponseType,
} from 'relay/mutations/SetOrderStatusCompleteMutation';

import './ManageOrderBlockForUser.scss';

import t from './i18n';

type PropsType = {
  environment: Environment,
  isAbleToSend: boolean,
  orderSlug: number,
  orderId: string,
  onOrderComplete: (success: boolean) => void,
  showAlert: (input: AddAlertInputType) => void,
};

type StateType = {
  isCompleteInProgress: boolean,
  isCreateDisputeInProgress: boolean,
  showModal: boolean,
  isDisputeShowModal: boolean,
  comment: string,
};

class ManageOrderBlock extends Component<PropsType, StateType> {
  state: StateType = {
    isCompleteInProgress: false,
    isCreateDisputeInProgress: false,
    showModal: false,
    isDisputeShowModal: false,
    comment: '',
  };

  completeOrder = () => {
    this.setState({
      isCompleteInProgress: true,
      showModal: false,
    });
    const params: SetOrderStatusCompleteMutationParamsType = {
      environment: this.props.environment,
      input: {
        clientMutationId: uuidv4(),
        orderSlug: this.props.orderSlug,
        committerRole: 'CUSTOMER',
      },
      onCompleted: (
        response: ?SetOrderStatusCompleteMutationResponseType,
        errors: ?Array<Error>,
      ) => {
        this.setState({ isCompleteInProgress: false });
        this.props.onOrderComplete(!errors);
      },
      onError: () => {
        this.setState({ isCompleteInProgress: false });
        this.props.onOrderComplete(false);
      },
    };
    SetOrderStatusCompleteMutation.commit(params);
  };

  createDispute = () => {
    const { orderId, orderSlug } = this.props;
    const { comment } = this.state;
    this.setState({ isCreateDisputeInProgress: true });
    CreateDisputeMutation({
      environment: this.props.environment,
      variables: {
        input: {
          clientMutationId: uuidv4(),
          orderSlug,
          comment,
        },
      },
      updater: relayStore => {
        const orderProxy = relayStore.get(orderId);
        orderProxy.setValue('DISPUTE', 'state');
      },
    })
      .then(() => true)
      .finally(() => {
        this.setState({
          isCreateDisputeInProgress: false,
          isDisputeShowModal: false,
        });
      })
      .catch(() => {
        this.props.showAlert({
          type: 'danger',
          text: t.somethingIsGoingWrong,
          link: {
            text: t.ok,
          },
        });
      });
  };

  handleCloseModal = () => {
    this.setState({
      showModal: false,
    });
  };

  handleDisputModalClose = () => {
    this.setState({
      isDisputeShowModal: false,
    });
  };

  handleCommentChanged = (e: ?SyntheticInputEvent<HTMLInputElement>) => {
    if (!isNil(e)) {
      const value = pathOr('', ['target', 'value'], e);
      this.setState({ comment: value });
    }
  };

  render() {
    const {
      isCompleteInProgress,
      showModal,
      isCreateDisputeInProgress,
      isDisputeShowModal,
      comment,
    } = this.state;
    return (
      <div styleName="container">
        <Modal
          showModal={isDisputeShowModal}
          onClose={this.handleDisputModalClose}
        >
          <div styleName="sendOrderModal">
            <div styleName="title">{t.createDispute}</div>
            <div styleName="description">{t.writeComment}</div>
            <div styleName="inputWrapperComment">
              <Textarea
                fullWidth
                id="disput-modal-comment"
                label={t.labelComment}
                onChange={this.handleCommentChanged}
                value={comment}
              />
            </div>
            <div styleName="disputButtonWrapper">
              <Button
                big
                fullWidth
                disabled={!comment}
                isLoading={isCreateDisputeInProgress}
                onClick={this.createDispute}
              >
                {t.createDispute}
              </Button>
            </div>
          </div>
        </Modal>
        <Confirmation
          showModal={showModal}
          onClose={this.handleCloseModal}
          title={t.title}
          description=""
          onCancel={this.handleCloseModal}
          onConfirm={this.completeOrder}
          confirmText={t.confirmText}
          cancelText={t.cancelText}
        />
        {this.props.isAbleToSend && (
          <Fragment>
            <div styleName="buttonWrapper">
              <Button
                big
                fullWidth
                isLoading={isCompleteInProgress}
                onClick={() => {
                  this.setState({ showModal: true });
                }}
              >
                {t.complete}
              </Button>
            </div>
            <div styleName="buttonWrapper">
              <Button
                big
                fullWidth
                wireframe
                isLoading={isCreateDisputeInProgress}
                onClick={() => {
                  this.setState({ isDisputeShowModal: true });
                }}
              >
                {t.dispute}
              </Button>
            </div>
          </Fragment>
        )}
      </div>
    );
  }
}

export default withShowAlert(ManageOrderBlock);
