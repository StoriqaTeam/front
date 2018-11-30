// @flow

import React from 'react';
import { Input } from 'components/common/Input';

import './AddressResultForm.scss';

import t from './i18n';

type PropsType = {
  address: any,
  onChangeForm: (type: string) => (e: any) => void,
};

const AddressResultForm = ({ address, onChangeForm }: PropsType) => (
  <div>
    <div styleName="row">
      <div styleName="itemWrapper odd">
        <Input
          fullWidth
          id="streetNumber"
          label={t.labelAptSuiteOther}
          onChange={onChangeForm('streetNumber')}
          value={address ? address.streetNumber : ''}
          limit={50}
        />
      </div>
      <div styleName="itemWrapper">
        <Input
          fullWidth
          id="route"
          label={t.labelStreetAddress}
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
          label={t.labelLocality}
          onChange={onChangeForm('locality')}
          value={address ? address.locality : ''}
          limit={50}
        />
      </div>
      <div styleName="itemWrapper">
        <Input
          fullWidth
          id="administrativeAreaLevel2"
          label={t.labelRegionState}
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
          label={t.labelAreaDistrict}
          onChange={onChangeForm('administrativeAreaLevel1')}
          value={address ? address.administrativeAreaLevel1 : ''}
          limit={50}
        />
      </div>
      <div styleName="itemWrapper">
        <Input
          fullWidth
          id="postalCode"
          label={t.labelPostalCode}
          onChange={onChangeForm('postalCode')}
          value={address ? address.postalCode : ''}
          limit={50}
        />
      </div>
    </div>
  </div>
);

export default AddressResultForm;
