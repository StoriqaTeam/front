// @flow strict

import React from 'react';
import type { Node } from 'react';
import classNames from 'classnames';
import { isNil } from 'ramda';

import './FormWrapper.scss';

type PropsType = {
  firstForm?: boolean,
  secondForm?: boolean,
  thirdForm?: boolean,
  children: Node,
  title: string,
  description: string,
};

const FormWrapper = ({
  firstForm,
  secondForm,
  thirdForm,
  children,
  title,
  description,
}: PropsType) => (
  <div
    styleName={classNames('formWrapper', {
      firstForm,
      secondForm,
      thirdForm,
    })}
  >
    <div styleName="headerTitle">{title}</div>
    <div styleName="headerDescription">{description}</div>
    {!isNil(children) && children}
  </div>
);

FormWrapper.defaultProps = {
  firstForm: false,
  secondForm: false,
  thirdForm: false,
};

export default FormWrapper;
