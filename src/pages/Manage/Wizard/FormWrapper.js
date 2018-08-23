// @flow

import React from 'react';
import classNames from 'classnames';

import './FormWrapper.scss';

type PropsType = {
  firstForm?: boolean,
  secondForm?: boolean,
  thirdForm?: boolean,
  children: any,
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
    {children && children}
  </div>
);

FormWrapper.defaultProps = {
  firstForm: false,
  secondForm: false,
  thirdForm: false,
};

export default FormWrapper;
