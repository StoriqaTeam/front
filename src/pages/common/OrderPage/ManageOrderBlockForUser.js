// @flow

import React, { Component } from 'react';
import { Environment } from 'relay-runtime';

import { Button } from 'components/common/Button';
import { SetOrderStatusCompleteMutation } from 'relay/mutations';

import type {
  MutationParamsType as SetOrderStatusCompleteMutationParamsType,
  SetOrderStatusCompleteMutationResponseType,
} from 'relay/mutations/SetOrderStatusCompleteMutation';

import './ManageOrderBlockForUser.scss';

type PropsType = {
  environment: Environment,
  isAbleToSend: boolean,
  orderSlug: number,
  onOrderComplete: (success: boolean) => void,
};

type StateType = {
  isCompleteInProgress: boolean,
};

class ManageOrderBlock extends Component<PropsType, StateType> {
  state: StateType = {
    isCompleteInProgress: false,
  };

  completeOrder = () => {
    // eslint-disable-next-line
    const isConfirmed = confirm('Are you sure to complete order?');
    if (!isConfirmed) {
      return;
    }

    this.setState({ isCompleteInProgress: true });
    const params: SetOrderStatusCompleteMutationParamsType = {
      environment: this.props.environment,
      input: {
        clientMutationId: '',
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

  render() {
    const { isCompleteInProgress } = this.state;
    return (
      <div styleName="container">
        {this.props.isAbleToSend && (
          <div styleName="completeButtonWrapper">
            <Button
              big
              fullWidth
              isLoading={isCompleteInProgress}
              onClick={this.completeOrder}
            >
              Complete
            </Button>
          </div>
        )}
      </div>
    );
  }
}

export default ManageOrderBlock;
