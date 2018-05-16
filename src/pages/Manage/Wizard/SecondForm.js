// @flow

import React from 'react';
import { map } from 'ramda';

import { Input } from 'components/common/Input';
import { Textarea } from 'components/common/Textarea';
import { Select } from 'components/common/Select';

import './Form.scss';

const languagesDic = {
  en: 'English',
  ch: 'Chinese',
  de: 'German',
  ru: 'Russian',
  es: 'Spanish',
  fr: 'French',
  ko: 'Korean',
  po: 'Portuguese',
  ja: 'Japanese',
};

type PropsType = {
  languages: Array<{ icoCode: string }>,
  data: {
    userId: ?number,
    storeId: ?number,
    name: ?string,
    shortDescription: ?string,
    defaultLanguage: ?string,
    slug: ?string,
    country: ?string,
    address: ?string,
  },
  onChange: (value: string, fieldName: string) => void,
  onSave: (value: string, fieldName: string) => void,
};

const SecondForm = ({ data, onChange, onSave, languages }: PropsType) => {
  console.log('^^^^ second form data: ', data);

  const handleOnChange = e => {
    const {
      target: { value, name },
    } = e;
    onChange(value, name);
  };

  const handleOnBlur = fieldName => () => {
    onSave(fieldName);
  };

  return (
    <div styleName="form">
      <div styleName="formItem">
        <Select
          forForm
          fullWidth
          label="Main language"
          // activeItem={data && data.defaultLanguage ? { id: data.defaultLanguage, label: 'ENG' } : null}
          items={map(item => ({
            id: item.isoCode,
            label: languagesDic[item.isoCode],
          }), languages)}
          onSelect={() => {}}
          dataTest="wizardLanguagesSelect"
        />
        {/* <Select
          forForm
          label="Main language"
          activeItem={defaultLanguageValue}
          items={langItems}
          onSelect={this.handleDefaultLanguage}
          tabIndexValue={0}
          dataTest="storeLangSelect"
        /> */}
      </div>
      <div styleName="formItem">
        <Input
          id="slug"
          value={data.slug}
          label="Slug"
          onChange={handleOnChange}
          onBlur={handleOnBlur('slug')}
          fullWidth
        />
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
