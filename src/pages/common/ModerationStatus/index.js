// @flow strict

import React, { Fragment } from 'react';
import classNames from 'classnames';

import type { ModerationStatusType } from 'types';

import './ModerationStatus.scss';
import t from '../../Manage/Store/Products/Product/Form/i18n';

type PropTypes = {
  status: ModerationStatusType,
  dataTest: string,
  link: ?string,
};

const ModerationStatus = (props: PropTypes) => (
  <Fragment>
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
    {props.status !== 'PUBLISHED' &&
      props.link != null && (
        <div styleName="previewLink">
          <a href={props.link} styleName="previewLinkButton" target="_blank">
            {t.preview}
          </a>
        </div>
      )}
  </Fragment>
);

export default ModerationStatus;
