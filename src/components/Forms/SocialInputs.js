// @flow

import React, { Component } from 'react';
import { propOr, values, join } from 'ramda';
import classNames from 'classnames';

import { Input } from 'components/Forms';
import { Icon } from 'components/Icon';

import './SocialInputs.scss';

type PropsType = {
  handleSocialInputsChange: Function,
  socialsValues: {
    facebookUrl: string,
    instagramUrl: string,
    twitterUrl: string,
  },
};

class SocialInputs extends Component<PropsType> {
  handleSocialInputsChange = (id: string) => (value: any) => {
    this.props.handleSocialInputsChange(id, value);
  };

  // facebookUrl: any;
  // twitterUrl: any;
  // instagramUrl: any;

  renderItem = (type: string) => {
    const id = `${type}Url`;
    return (
      <div>
        <Input
          // TODO: fix it
          // $FlowIgnore
          ref={(node) => { this[type] = node; }}
          forForm
          imgLabel={type}
          id={id}
          value={propOr('', id, this.props.socialsValues)}
          onChange={this.handleSocialInputsChange(id)}
        />
      </div>
    );
  };

  render() {
    const { socialsValues } = this.props;
    const isValues = Boolean(join('')(values(socialsValues)));
    return (
      <div styleName={classNames('container', isValues && 'isValues')}>
        <div styleName="label">
          Social
          <div styleName="icon">
            <Icon type="pencil" />
          </div>
        </div>
        <div>
          {this.renderItem('facebook')}
          {this.renderItem('instagram')}
          {this.renderItem('twitter')}
        </div>
      </div>
    );
  }
}

export default SocialInputs;
