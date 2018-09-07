// @flow strict

import React from 'react';
import { Input } from 'components/common/Input';

import type { AddressFullType } from './AddressForm';

import './AddressResultForm.scss';

type PropsType = {
  address: ?AddressFullType,
  onChangeForm: (type: string) => (e: { target: { value: string } }) => void,
};

const AddressResultForm = ({ address, onChangeForm }: PropsType) => (
  <div>
    <div styleName="row">
      <div styleName="itemWrapper odd">
        <Input
          fullWidth
          id="streetNumber"
          label="Apt / Suite / Other"
          onChange={onChangeForm('streetNumber')}
          value={address ? address.streetNumber : ''}
          limit={50}
        />
      </div>
      <div styleName="itemWrapper">
        <Input
          fullWidth
          id="route"
          label="Street address"
          onChange={onChangeForm('route')}
          value={address ? address.route : ''}
          limit={50}
        />
      </div>
    </div>
    <div styleName="row">
      <div styleName="itemWrapper odd">
        <Input
          fullWidth
          id="locality"
          label="City"
          onChange={onChangeForm('locality')}
          value={address ? address.locality : ''}
          limit={50}
        />
      </div>
      <div styleName="itemWrapper">
        <Input
          fullWidth
          id="administrativeAreaLevel2"
          label="Region / State"
          onChange={onChangeForm('administrativeAreaLevel2')}
          value={address ? address.administrativeAreaLevel2 : ''}
          limit={50}
        />
      </div>
    </div>
    <div styleName="row">
      <div styleName="itemWrapper odd">
        <Input
          fullWidth
          id="administrativeAreaLevel1"
          label="Area / District"
          onChange={onChangeForm('administrativeAreaLevel1')}
          value={address ? address.administrativeAreaLevel1 : ''}
          limit={50}
        />
      </div>
      <div styleName="itemWrapper">
        <Input
          fullWidth
          id="postalCode"
          label="Postal Code"
          onChange={onChangeForm('postalCode')}
          value={address ? address.postalCode : ''}
          limit={50}
        />
      </div>
    </div>
  </div>
);

export default AddressResultForm;
