// @flow

import React from 'react';
import { Checkbox } from 'components/common/Checkbox';

import './Policy.scss';

type PropsType = {
  isPrivacyChecked: boolean,
  isTermsChecked: boolean,
  onCheck: string => void,
};

const Policy = ({ isPrivacyChecked, isTermsChecked, onCheck }: PropsType) => (
  <div styleName="policy">
    <div styleName="policyText">
      <span styleName="checkbox">
        <Checkbox
          id="terms"
          checked={isPrivacyChecked}
          onChange={() => onCheck('isPrivacyChecked')}
        />
      </span>
      Check here to indicate that you have read and agree to the Terms of Use.
    </div>
    <div styleName="policyText">
      <span styleName="checkbox">
        <Checkbox
          id="privacy"
          checked={isTermsChecked}
          onChange={() => onCheck('isTermsChecked')}
        />
      </span>
      I agree to my personal data being stored and used.{' '}
      <a href="/" styleName="link">
        Privacy Policy
      </a>
    </div>
  </div>
);

export default Policy;
