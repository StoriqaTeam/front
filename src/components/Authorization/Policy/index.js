// @flow strict

import React from 'react';
import { Checkbox } from 'components/common/Checkbox';

import t from './i18n';

import './Policy.scss';

type PropsType = {
  isPrivacyChecked: boolean,
  isTermsChecked: boolean,
  onCheck: string => void,
};

const Policy = ({ isPrivacyChecked, isTermsChecked, onCheck }: PropsType) => (
  <div styleName="container">
    <div styleName="policyText">
      <span styleName="checkbox">
        <Checkbox
          id="terms"
          isChecked={isPrivacyChecked}
          onChange={() => onCheck('isPrivacyChecked')}
        />
      </span>
      <p>
        {t.checkHere}{' '}
        <a
          href="/terms_of_use.pdf"
          target="_blank"
          rel="noopener noreferrer"
          styleName="link"
        >
          {t.termsOfUse}
        </a>{' '}
        {t.and}{' '}
        <a
          href="/privacy_policy.pdf"
          target="_blank"
          rel="noopener noreferrer"
          styleName="link"
        >
          {t.privatePolicy}
        </a>.
      </p>
    </div>
    <div styleName="policyText">
      <span styleName="checkbox">
        <Checkbox
          id="privacy"
          isChecked={isTermsChecked}
          onChange={() => onCheck('isTermsChecked')}
        />
      </span>
      <p>{t.agree}</p>
    </div>
  </div>
);

export default Policy;
