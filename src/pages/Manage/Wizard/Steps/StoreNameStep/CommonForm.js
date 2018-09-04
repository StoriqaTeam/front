// @flow strict

import * as React from 'react';
import { assoc } from 'ramda';

import { FormComponent, validators } from 'components/Forms/lib';
import { Input } from 'components/common/Input';
import { Textarea } from 'components/common/Textarea';
import { InputSlug } from 'components/common/InputSlug';
import type { FormHandlersType, FormValidatorType } from 'components/Forms/lib';

import FormWrapper from '../../FormWrapper';

import './CommonForm.scss';

type FormInputs = {
  name: string,
  slug: string,
  desc: string,
};
export type { FormInputs as CommonFormFormInputs };

type HandlersType = FormHandlersType<FormInputs>;

class CommonForm<PropsType> extends FormComponent<FormInputs, PropsType> {
  state = {
    form: {
      name: '',
      desc: '',
      slug: '',
    },
    validationErrors: {},
    isSubmitting: false,
  };

  handlers: HandlersType = {
    name: assoc('name'),
    slug: assoc('slug'),
    desc: assoc('desc'),
  };

  validators: FormValidatorType<FormInputs> = {
    name: validators.notEmpty,
    desc: validators.notEmpty,
  };

  transformValidationErrors = (serverValidationErrors: {
    [string]: Array<string>,
  }): { [$Keys<FormInputs>]: Array<string> } => ({
    slug: serverValidationErrors.slug || [],
    name: serverValidationErrors.name || [],
    desc: serverValidationErrors.shortDescription || [],
  });

  handle(input: $Keys<FormInputs>, value: $Values<FormInputs>): void {
    if (this.state.isSubmitting) {
      return;
    }

    const handler = this.handlers[input](value);
    this.setState(assoc('form', handler(this.state.form)));
  }

  render() {
    return (
      <FormWrapper
        firstForm
        title="Give your store a name"
        description="Make a bright name for your store to attend your customers and encrease your sales"
      >
        <div styleName="form">
          <div styleName="formItem">
            <Input
              id="name"
              value={this.state.form.name}
              label={
                <span>
                  Store name <span styleName="red">*</span>
                </span>
              }
              onChange={(e: { target: { value: string } }) => {
                this.handle('name', e.target.value);
              }}
              fullWidth
              errors={this.state.validationErrors.name}
            />
          </div>
          <div styleName="formItem">
            <InputSlug
              realSlug="an"
              slug={this.state.form.slug}
              onChange={(value: string) => {
                this.handle('slug', value);
              }}
              errors={this.state.validationErrors.slug}
            />
          </div>
          <div>
            <Textarea
              id="shortDescription"
              value={this.state.form.desc}
              label={
                <span>
                  Short description <span styleName="red">*</span>
                </span>
              }
              onChange={(e: { target: { value: string } }) => {
                this.handle('desc', e.target.value);
              }}
              fullWidth
              errors={this.state.validationErrors.desc}
            />
          </div>
          <br />
          <button disabled={this.state.isSubmitting} onClick={this.submit}>
            Save
          </button>
        </div>
      </FormWrapper>
    );
  }
}

export default CommonForm;
