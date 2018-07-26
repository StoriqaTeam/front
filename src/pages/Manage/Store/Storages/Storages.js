// @flow

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { pathOr, isEmpty, map } from 'ramda';
import { withRouter, routerShape } from 'found';
import { graphql, createFragmentContainer } from 'react-relay';
import type { Environment } from 'relay-runtime';

import { Page } from 'components/App';
import { ManageStore } from 'pages/Manage/Store';
import { log, fromRelayError } from 'utils';
import { withShowAlert } from 'components/App/AlertContext';
import { Button } from 'components/common/Button';

import { DeleteWarehouseMutation } from 'relay/mutations';
import type { MutationParamsType } from 'relay/mutations/DeleteWarehouseMutation';
import type { AddAlertInputType } from 'components/App/AlertContext';
import type { Storages_me as StoragesMeType } from './__generated__/Storages_me.graphql';

import { StoragesHeader, StoragesRow } from './index';

import './Storages.scss';

type PropsType = {
  router: routerShape,
  showAlert: (input: AddAlertInputType) => void,
  me: StoragesMeType,
  environment: Environment,
};

class Storages extends PureComponent<PropsType> {
  createStorage = () => {
    // $FlowIgnoreMe
    const storeId = pathOr(null, ['match', 'params', 'storeId'], this.props);

    if (storeId) {
      this.props.router.push(`/manage/store/${storeId}/storage/new`);
    }
  };

  handleEdit = (slug: ?string, isStorageData: boolean, e: any): void => {
    e.stopPropagation();
    // $FlowIgnoreMe
    const storeId = pathOr(null, ['match', 'params', 'storeId'], this.props);
    if (storeId && slug) {
      this.props.router.push(
        `/manage/store/${storeId}/storages/${slug}${
          isStorageData ? '/edit' : ''
        }`,
      );
    }
  };

  handleCheckboxClick = (id: string | number) => {
    log.info('id', id);
  };

  handleDelete = (id: string, e: any) => {
    e.stopPropagation();
    const { environment } = this.props;
    const params: MutationParamsType = {
      id,
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
          text: 'Storage delete!',
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
  };

  render() {
    const { me } = this.props;
    // $FlowIgnoreMe
    const storages = pathOr([], ['myStore', 'warehouses'], me);
    return (
      <div styleName="container">
        <header styleName="headerBar">
          <div styleName="subtitle">
            <strong>Items list</strong>
          </div>
          <div styleName="addButton">
            <Button
              wireframe
              big
              onClick={this.createStorage}
              dataTest="createStorageButton"
            >
              Add storage
            </Button>
          </div>
        </header>
        <div>
          <StoragesHeader />
          <div>
            {isEmpty(storages) ? (
              <div styleName="emptyStoragesBlock">No storages</div>
            ) : (
              map(
                item => (
                  <StoragesRow
                    key={item.id}
                    {...item}
                    onEdit={this.handleEdit}
                    onDelete={this.handleDelete}
                    handleCheckboxClick={this.handleCheckboxClick}
                  />
                ),
                storages,
              )
            )}
          </div>
        </div>
      </div>
    );
  }
}

Storages.contextTypes = {
  showAlert: PropTypes.func,
};

export default createFragmentContainer(
  withShowAlert(withRouter(Page(ManageStore(Storages, 'Storages')))),
  graphql`
    fragment Storages_me on User {
      myStore {
        rawId
        warehouses {
          id
          name
          slug
          addressFull {
            country
            administrativeAreaLevel1
            administrativeAreaLevel2
            political
            postalCode
            streetNumber
            value
            route
            locality
          }
        }
      }
    }
  `,
);
