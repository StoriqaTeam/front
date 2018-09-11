// @flow strict

import { isEmpty, complement, both, is, gt, __ } from 'ramda';
import { validate as validateLib } from '@storiqa/shared';

import type { FormValidatorType } from '../lib';

const validators = {
  notEmpty: [[complement(isEmpty), 'Field should not be empty']],
  isPositiveNumber: [
    [both(is(Number), gt(__, 0)), 'Should be positive number'],
  ],
};

const validate = <FS: {}>(
  form: FS,
  validators: FormValidatorType<FS>, // eslint-disable-line
): {
  [$Keys<FS>]: Array<string>,
} => {
  const { errors } = validateLib(validators, form);
  return errors || {};
};

export { validators, validate };
