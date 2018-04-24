// @flow

import React from 'react';
import { Input } from 'components/common/Input';

import './AddressResultForm.scss';

type PropsType = {
  address: any,
  onChangeForm: (type: string) => (e: any) => void,
}

const AddressResultForm = ({ address, onChangeForm }: PropsType) => (
  <div>
    <div styleName="row">
      <div styleName="itemWrapper">
        <Input
          id="street-number"
          label="Apt / Suite / Other"
          onChange={onChangeForm('street_number')}
          value={address.street_number}
          limit={50}
        />
      </div>
      <div styleName="itemWrapper">
        <Input
          id="route"
          label="Street address"
          onChange={onChangeForm('route')}
          value={address.route}
          limit={50}
        />
      </div>
    </div>
    <div styleName="row">
      <div styleName="itemWrapper">
        <Input
          id="locality"
          label="City"
          onChange={onChangeForm('locality')}
          value={address.locality}
          limit={50}
        />
      </div>
      <div styleName="itemWrapper">
        <Input
          id="administrative_area_level_2"
          label="Region / State"
          onChange={onChangeForm('administrative_area_level_2')}
          value={address.administrative_area_level_2}
          limit={50}
        />
      </div>
    </div>
    <div styleName="row">
      <div styleName="itemWrapper">
        <Input
          id="administrative_area_level_1"
          label="Area / District"
          onChange={onChangeForm('administrative_area_level_1')}
          value={address.administrative_area_level_1}
          limit={50}
        />
      </div>
      <div styleName="itemWrapper">
        <Input
          id="postal_code"
          label="Postal Code"
          onChange={onChangeForm('postal_code')}
          value={address.postal_code}
          limit={50}
        />
      </div>
    </div>
  </div>
);

export default AddressResultForm;
