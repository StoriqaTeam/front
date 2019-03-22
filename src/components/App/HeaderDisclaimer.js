// @flow strict

import React, { Component } from 'react';

import { Icon } from 'components/Icon';
import { setCookie, getCookie } from 'utils';
import moment from 'moment';

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
          <div styleName="textWrap">
            <span styleName="text">
              Dear users! Currently Storiqa is&nbsp;working
              in&nbsp;the&nbsp;testing&nbsp;mode. If&nbsp;you have any questions
              or&nbsp;problems, please follow the&nbsp;link.
            </span>
            <a
              href="https://storiqa.zendesk.com/hc/en-us/requests/new"
              styleName="link"
              rel="noopener noreferrer"
              target="_blank"
            >
              Support
            </a>
          </div>
          <button styleName="cross" onClick={this.handleHiddenDisclaimer}>
            <Icon type="cross" size={8} />
          </button>
        </div>
      </div>
    );
  }
}

export default HeaderDisclaimer;
