// @flow

import React from 'react';
import { map, find, assocPath } from 'ramda';

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

  const handleOnChange = e => {
    const {
      target: { value, name },
    } = e;
    onChange(name, value);
  };

  const handleOnBlur = fieldName => () => {
    onSave(fieldName);
  };

  const handleOnSelectLanguage = item => {
    onChange('defaultLanguage', item.id);
    onSave('defaultLanguage', item.id);
  };

  const handleChangeAddressData = data => {
    console.log('^^^^ SecondForm handleChangeAddressData: ', data);
  };

  const languagesItems = map(
    item => ({
      id: item.isoCode.toUpperCase(),
      label: languagesDic[item.isoCode.toUpperCase()],
    }),
    languages,
  );

  const findActiveItem = find(item => item.id === data.defaultLanguage);

  return (
    <div styleName="form">
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
      <div styleName="formItem">
        <AddressForm isOpen onChangeData={handleChangeAddressData} />
      </div>
      <div>
        <Textarea
          id="shortDescription"
          value={data.shortDescription}
          label="Short description"
          onChange={handleOnChange}
          onBlur={handleOnBlur('shortDescription')}
          fullWidth
        />
      </div>
    </div>
  );
};

export default SecondForm;
