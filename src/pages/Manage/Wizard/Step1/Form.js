// @flow

import React from 'react';

import { Input } from 'components/common/Input';
import { Textarea } from 'components/common/Textarea';

import './Form.scss';

type FirstFormPropsType = {
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
  onChange: (fieldName: string, value: string) => void,
};

const FirstForm = ({ data, onChange }: FirstFormPropsType) => {
  const handleOnChange = e => {
    const {
      target: { value, name },
    } = e;
    onChange({ [name]: value });
  };

  return (
    <div styleName="form">
      <div styleName="formItem">
        <Input
          id="name"
          value={data.name}
          label="Name"
          onChange={handleOnChange}
          fullWidth
        />
      </div>
      <div styleName="formItem">
        <Input
          id="slug"
          value={data.slug}
          label="Slug"
          onChange={handleOnChange}
          fullWidth
        />
      </div>
      <div>
        <Textarea
          id="shortDescription"
          value={data.shortDescription ? data.shortDescription : ''}
          label="Short description"
          onChange={handleOnChange}
          fullWidth
        />
      </div>
    </div>
  );
};

export default FirstForm;
