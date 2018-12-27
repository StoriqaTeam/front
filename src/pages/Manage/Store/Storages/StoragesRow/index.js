// @flow strict

import React from 'react';

import { Icon } from 'components/Icon';
import { Col } from 'layout';

import { addressToString } from 'utils';

import type { AddressFullType } from 'types';

import './StoragesRow.scss';

import t from './i18n';

type PropsType = {
  onEdit: (
    string,
    boolean,
    SyntheticEvent<HTMLDivElement | HTMLButtonElement>,
  ) => void,
  // onDelete: () => void,
  id: string,
  name: string,
  slug: string,
  addressFull: AddressFullType,
};

const StoragesRow = ({
  onEdit,
  // onDelete,
  id,
  name,
  slug,
  addressFull,
}: PropsType) => (
  <div
    key={id}
    styleName="container"
    onClick={(e: SyntheticEvent<HTMLDivElement>) => {
      e.stopPropagation();
      onEdit(slug, false, e);
    }}
    onKeyDown={() => {}}
    role="button"
    tabIndex="0"
    data-test="editStorageField"
  >
    <Col size={12} sm={12} md={5} lg={3} xl={3}>
      <div styleName="storageName">
        <div>{name || `Storage ${slug}`}</div>
      </div>
    </Col>
    <Col size={12} sm={12} md={4} lg={8} xl={8}>
      <address styleName="address">
        <span>{addressToString(addressFull) || t.addressNotSpecified}</span>
      </address>
    </Col>
    <Col size={12} sm={6} md={3} lg={1} xl={1} mdVisible>
      <div styleName="buttonsWrapper">
        <button
          styleName="editButton"
          onClick={(e: SyntheticEvent<HTMLButtonElement>) => {
            onEdit(slug, true, e);
          }}
          data-test="editStorageDataButton"
        >
          <Icon type="note" size={32} />
        </button>
        {/* <button
          styleName="deleteButton"
          onClick={(e: any) => {
            onDelete(id, e);
          }}
          data-test="deleteStorageButton"
        >
          <Icon type="basket" size="32" />
        </button> */}
      </div>
    </Col>
  </div>
);

export default StoragesRow;
