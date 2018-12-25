// @flow strict

import React from 'react';
import classNames from 'classnames';

import type { ModerationStatusType } from 'types';

import './ModerationStatus.scss';

type PropTypes = {
  status: ModerationStatusType,
  dataTest: string,
};

const ModerationStatus = (props: PropTypes) => (
  <div
    styleName={classNames('container', {
      draft: props.status === 'DRAFT',
      moderation: props.status === 'MODERATION',
      decline: props.status === 'DECLINE',
      published: props.status === 'PUBLISHED',
      blocked: props.status === 'BLOCKED',
    })}
    data-test={props.dataTest}
  >
    {props.status}
  </div>
);

export default ModerationStatus;
