// @flow

import React from 'react';
import { map, find } from 'ramda';
import debounce from 'lodash.debounce';

// import { Input } from 'components/common/Input';
import { Textarea } from 'components/common/Textarea';
import { Select } from 'components/common/Select';
import { AddressForm } from 'components/AddressAutocomplete';

import './Form.scss';

const languagesDic = {
  EN: 'English',
  CH: 'Chinese',
  DE: 'German',
  RU: 'Russian',
  ES: 'Spanish',
  FR: 'French',
  KO: 'Korean',
  PO: 'Portuguese',
  JA: 'Japanese',
};

type PropsType = {
  languages: Array<{ isoCode: string }>,
  data: {
    userId: ?number,
    storeId: ?number,
    name: ?string,
    slug: ?string,
    shortDescription: ?string,
    defaultLanguage: ?string,
    country: ?string,
    address: ?string,
  },
  onChange: (value: string, fieldName: string) => void,
  onSave: (value: string, fieldName: string) => void,
};

const SecondForm = ({ data, onChange, onSave, languages }: PropsType) => {
  // console.log('^^^^ second form data: ', data);

  // const handleOnChange = e => {
  //   const {
  //     target: { value, name },
  //   } = e;
  //   onChange(name, value);
  // };

  const handleOnSelectLanguage = item => {
    onChange('defaultLanguage', item.id);
    onSave({ defaultLanguage: item.id });
  };

  const handleChangeAddressData = addressData => {
    console.log('^^^^ SecondForm handleChangeAddressData: ', addressData);

    // debounce(() => onSave('addressFull', addressData.address));

    if (addressData && addressData) {
      onSave(addressData);
    }
  };

  const languagesItems = map(
    item => ({
      id: item.isoCode.toUpperCase(),
      label: languagesDic[item.isoCode.toUpperCase()],
    }),
    languages,
  );

  const findActiveItem = find(item => item.id === data.defaultLanguage);

  const { addressFull } = data;

  return (
    <div styleName="form secondForm">
      <div styleName="formItem">
        <Select
          forForm
          fullWidth
          label="Main language"
          activeItem={findActiveItem(languagesItems)}
          items={languagesItems}
          onSelect={handleOnSelectLanguage}
          dataTest="wizardLanguagesSelect"
        />
      </div>
      <div styleName="formItem addressForm">
        <AddressForm
          isOpen
          onChangeData={handleChangeAddressData}
          country={addressFull ? addressFull.country : null}
          address={addressFull ? addressFull.value : null}
          addressFull={addressFull}
        />
      </div>
    </div>
  );
};

export default SecondForm;
