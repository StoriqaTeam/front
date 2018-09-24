import React from 'react';

import { Icon } from 'components/Icon';
import { Checkbox } from 'components/common/Checkbox';
import { Col } from 'layout';

import { addressToString } from 'utils';

import './StoragesRow.scss';

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
  onEdit: () => void,
  // onDelete: () => void,
  handleCheckboxClick: (id: string | number) => void,
  id: string,
  name: string,
  slug: string,
  addressFull: AddressFullType,
};

const StoragesRow = ({
  onEdit,
  // onDelete,
  handleCheckboxClick,
  id,
  name,
  slug,
  addressFull,
}: PropsType) => (
  <div
    key={id}
    styleName="container"
    onClick={(e: any) => {
      onEdit(slug, false, e);
    }}
    onKeyDown={() => {}}
    role="button"
    tabIndex="0"
    data-test="editStorageField"
  >
    <Col size={12} sm={12} md={5} lg={3} xl={3}>
      <div styleName="storageName">
        <span styleName="checkBox">
          <Checkbox id={`storage-${id}`} onChange={handleCheckboxClick} />
        </span>
        <div>{name || `Storage ${slug}`}</div>
      </div>
    </Col>
    <Col size={12} sm={12} md={4} lg={8} xl={8}>
      <address styleName="address">
        <span>{addressToString(addressFull) || 'Address not specified'}</span>
      </address>
    </Col>
    <Col size={12} sm={6} md={3} lg={1} xl={1} mdVisible>
      <div styleName="buttonsWrapper">
        <button
          styleName="editButton"
          onClick={(e: any) => {
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
