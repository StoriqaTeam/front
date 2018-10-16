// @flow strict

import React from 'react';

import t from './i18n';

import './HeaderDisclaimer.scss';

const HeaderDisclaimer = () => (
  <div styleName="container">
    <div styleName="body">
      <div>
        <strong>{t.disclainer}</strong>
      </div>
      <div>{t.questions}</div>
      <div styleName="link">
        <a
          href="https://storiqa.zendesk.com/hc/en-us/requests/new"
          rel="noopener noreferrer"
          target="_blank"
        >
          {t.support}
        </a>
      </div>
    </div>
  </div>
);

export default HeaderDisclaimer;
