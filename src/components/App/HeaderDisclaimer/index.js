// @flow strict

import React, { Component } from 'react';

import { Icon } from 'components/Icon';
import { setCookie, getCookie } from 'utils';
import moment from 'moment';

import t from './i18n';

import './HeaderDisclaimer.scss';

type StateType = {
  hidden: boolean,
};

class HeaderDisclaimer extends Component<{}, StateType> {
  state = {
    hidden: false,
  };

  componentDidMount() {
    const cookieDisclaimer = getCookie('disclaimer');
    if (cookieDisclaimer) {
      if (process.env.BROWSER) {
        this.handleHiddenDisclaimer();
      }
    }
  }

  handleHiddenDisclaimer = () => {
    this.setState({ hidden: true }, () => {
      setCookie(
        'disclaimer',
        true,
        moment()
          .utc()
          .add(7, 'd')
          .toDate(),
      );
    });
  };

  render() {
    if (this.state.hidden) {
      return null;
    }
    return (
      <div styleName="container">
        <div styleName="body">
          <div styleName="text">
            {t.disclainer}
            {t.questions}
          </div>
          <a
            href="https://storiqa.zendesk.com/hc/en-us/requests/new"
            styleName="link"
            rel="noopener noreferrer"
            target="_blank"
          >
            {t.support}
          </a>
          <button styleName="cross" onClick={this.handleHiddenDisclaimer}>
            <Icon type="cross" size={16} />
          </button>
        </div>
      </div>
    );
  }
}

export default HeaderDisclaimer;
