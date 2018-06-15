// @flow

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { pathOr, isEmpty, map } from 'ramda';
import { withRouter, routerShape } from 'found';
import { graphql, Relay, createFragmentContainer } from 'react-relay';

import { Page } from 'components/App';
import { ManageStore } from 'pages/Manage/Store';
import { log, fromRelayError } from 'utils';
import { withShowAlert } from 'components/App/AlertContext';
import { Button } from 'components/common/Button';
import { Checkbox } from 'components/common/Checkbox';
import { Icon } from 'components/Icon';

import { DeleteWarehouseMutation } from 'relay/mutations';
import type { MutationParamsType } from 'relay/mutations/DeleteWarehouseMutation';
import type { AddAlertInputType } from 'components/App/AlertContext';
import type { Storages_me as StoragesMeType } from './__generated__/Storages_me.graphql';

import storages from './storages.json';

import './Storages.scss';

type PropsType = {
  router: routerShape,
  showAlert: (input: AddAlertInputType) => void,
  me: StoragesMeType,
};

class Storages extends PureComponent<PropsType> {
  createStorage = () => {
    // $FlowIgnoreMe
    const storeId = pathOr(null, ['match', 'params', 'storeId'], this.props);

    if (storeId) {
      this.props.router.push(`/manage/store/${storeId}/storage/new`);
    }
  };

  editStorage = (id: number) => {
    // $FlowIgnoreMe
    const storeId = pathOr(null, ['match', 'params', 'storeId'], this.props);
    if (storeId) {
      this.props.router.push(`/manage/store/${storeId}/storages/${id}`);
    }
  };

  handleDelete = (id: string) => {
    log.info('---id', id);
    /*
    const { environment } = this.context;
    const params: MutationParamsType = {
      input: {
        clientMutationId: '',
        id: parseInt(id, 10),
      },
      environment,
      onCompleted: (response: ?Object, errors: ?Array<any>) => {
        log.debug({ response, errors });

        const relayErrors = fromRelayError({ source: { errors } });
        log.debug({ relayErrors });
        // $FlowIgnoreMe
        const validationErrors = pathOr({}, ['100', 'messages'], relayErrors);
        if (!isEmpty(validationErrors)) {
          this.props.showAlert({
            type: 'danger',
            text: `Something going wrong :(`,
            link: { text: 'Close.' },
          });
          return;
        }
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
          text: 'Saved!',
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
    DeleteWarehouseMutation.commit(params);
    */
  };

  // storagesRefetch = () => {
  //   this.props.relay.loadMore(8);
  // };

  renderHeaderRow = () => (
    <div styleName="headerRowWrap">
      <div styleName="td tdCheckbox">
        <Checkbox id="header" onChange={() => {}} />
      </div>
      <div styleName="td tdStorage">
        <div>
          <span>Storage</span>
          <Icon inline type="sortArrows" />
        </div>
      </div>
      <div styleName="td tdAddress">
        <div>
          <span>Address</span>
          <Icon inline type="sortArrows" />
        </div>
      </div>
      <div styleName="td tdEdit" />
      <div styleName="td tdDelete">
        <button styleName="deleteButton">
          <Icon type="basket" size="32" />
        </button>
      </div>
    </div>
  );

  renderRows = (item: {
    id: string,
    rawId: number,
    name: string,
    address: string,
  }) => {
    const { id, rawId, name, address } = item;
    return (
      <div key={item.rawId} styleName="itemRowWrap">
        <div styleName="td tdCheckbox">
          <Checkbox id={`storage-${item.rawId}`} onChange={() => {}} />
        </div>
        <div styleName="td tdStorage">
          <div>
            <span>{name}</span>
          </div>
        </div>
        <div styleName="td tdAddress">
          <div>
            <span>{address}</span>
          </div>
        </div>
        <div styleName="td tdEdit">
          <button
            styleName="editButton"
            onClick={() => {
              this.editStorage(rawId);
            }}
          >
            <Icon type="note" size={32} />
          </button>
        </div>
        <div styleName="td tdDelete">
          <button
            styleName="deleteButton"
            onClick={() => {
              this.handleDelete(id);
            }}
          >
            <Icon type="basket" size="32" />
          </button>
        </div>
      </div>
    );
  };

  render() {
    return (
      <div styleName="container">
        <div styleName="addButton">
          <Button wireframe big onClick={this.createStorage}>
            Add storage
          </Button>
        </div>
        <div styleName="subtitle">
          <strong>Items list</strong>
        </div>
        <div>
          <div>{this.renderHeaderRow()}</div>
          <div>{map(item => this.renderRows(item.node), storages)}</div>
        </div>
        {/* this.props.relay.hasMore() && (
          <div styleName="loadButton">
            <Button
              big
              load
              onClick={this.storagesRefetch}
              dataTest="searchProductLoadMoreButton"
            >
              Load more
            </Button>
          </div>
        )} */}
      </div>
    );
  }
}

Storages.contextTypes = {
  environment: PropTypes.object.isRequired,
  showAlert: PropTypes.func,
};

// export default withShowAlert(withRouter(Page(ManageStore(Storages, 'Storages'))));

export default createFragmentContainer(
  withShowAlert(withRouter(Page(ManageStore(Storages, 'Storages')))),
  graphql`
    fragment Storages_me on User
      @argumentDefinitions(
        first: { type: "Int", defaultValue: 8 }
        after: { type: "ID", defaultValue: null }
        storeId: { type: "Int!" }
      ) {
      store(id: $storeId) {
        id
        logo
        name {
          text
          lang
        }
      }
    }
  `,
);
