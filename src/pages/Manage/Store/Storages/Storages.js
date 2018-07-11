// @flow

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { pathOr, isEmpty, map } from 'ramda';
import { withRouter, routerShape } from 'found';
import { graphql, createFragmentContainer } from 'react-relay';

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

import './Storages.scss';

type AddressFullType = {
  administrativeAreaLevel1: ?string,
  administrativeAreaLevel2: ?string,
  country: string,
  locality: ?string,
  political: ?string,
  postalCode: string,
  route: ?string,
  streetNumber: ?string,
  value: ?string,
};

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

  editStorage = (slug: ?string, isStorageData: boolean, e: any) => {
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

  handleDelete = (id: string, e: any) => {
    e.stopPropagation();
    const { environment } = this.context;
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
    name: string,
    slug: string,
    addressFull: AddressFullType,
  }) => {
    const { id, name, slug, addressFull } = item;
    const { country, locality, value } = addressFull;
    return (
      <div
        key={item.id}
        styleName="itemRowWrap"
        onClick={(e: any) => {
          this.editStorage(slug, false, e);
        }}
        onKeyDown={() => {}}
        role="button"
        tabIndex="0"
      >
        <div styleName="td tdCheckbox">
          <span
            onClick={(e: any) => {
              this.editStorage(null, false, e);
            }}
            onKeyDown={() => {}}
            role="button"
            tabIndex="0"
          >
            <Checkbox id={`storage-${item.id}`} onChange={() => {}} />
          </span>
        </div>
        <div styleName="td tdStorage">
          <div>{name}</div>
        </div>
        <div styleName="td tdAddress">
          <div styleName="address">
            <span>{`${country}`}</span>
            {locality && <span>{`, ${locality}`}</span>}
            {value && <span>{`, ${value}`}</span>}
          </div>
        </div>
        <div styleName="td tdEdit">
          <button
            styleName="editButton"
            onClick={(e: any) => {
              this.editStorage(slug, true, e);
            }}
          >
            <Icon type="note" size={32} />
          </button>
        </div>
        <div styleName="td tdDelete">
          <button
            styleName="deleteButton"
            onClick={(e: any) => {
              this.handleDelete(id, e);
            }}
          >
            <Icon type="basket" size="32" />
          </button>
        </div>
      </div>
    );
  };

  render() {
    const { me } = this.props;
    // $FlowIgnoreMe
    const storages = pathOr([], ['myStore', 'warehouses'], me);
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
          <div>
            {isEmpty(storages) ? (
              <div styleName="emptyStoragesBlock">No storages</div>
            ) : (
              map(item => this.renderRows(item), storages)
            )}
          </div>
        </div>
      </div>
    );
  }
}

Storages.contextTypes = {
  environment: PropTypes.object.isRequired,
  showAlert: PropTypes.func,
};

export default createFragmentContainer(
  withShowAlert(withRouter(Page(ManageStore(Storages, 'Storages')))),
  graphql`
    fragment Storages_me on User {
      myStore {
        id
        logo
        name {
          text
          lang
        }
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
