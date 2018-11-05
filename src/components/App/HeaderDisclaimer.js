// @flow strict

import React from 'react';

import './HeaderDisclaimer.scss';

const HeaderDisclaimer = () => (
  <div styleName="container">
    <div styleName="body">
      <div>
        <strong>
          Dear users! Currently Storiqa is&nbsp;working
          in&nbsp;the&nbsp;demo&nbsp;testing&nbsp;mode.
        </strong>
      </div>
      <div>
        If you have any questions or&nbsp;problems, please follow
        the&nbsp;link&nbsp;below.
      </div>
      <div styleName="link">
        <a
          href="https://storiqa.zendesk.com/hc/en-us/requests/new"
          rel="noopener noreferrer"
          target="_blank"
        >
          Support
        </a>
      </div>
    </div>
  </div>
);

export default HeaderDisclaimer;
