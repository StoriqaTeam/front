// @flow strict

import React from 'react';
import { Checkbox } from 'components/common/Checkbox';

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
        Check here to indicate that you have read and agree to the{' '}
        <a
          href="https://s3.eu-west-2.amazonaws.com/storiqa/Terms+of+use+STORIQA(Final).pdf"
          target="_blank"
          rel="noopener noreferrer"
          styleName="link"
        >
          Terms of Use
        </a>{' '}
        and{' '}
        <a
          href="https://s3.eu-west-2.amazonaws.com/storiqa/Privacy+Policy.pdf"
          target="_blank"
          rel="noopener noreferrer"
          styleName="link"
        >
          Privacy Policy
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
      <p>I agree to my personal data being stored and used.</p>
    </div>
  </div>
);

export default Policy;
