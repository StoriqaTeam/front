// @flow strict

import React from 'react';
import { isNil } from 'ramda';
import { Icon } from 'components/Icon';

import './SearchNoResults.scss';

import t from './i18n';

type PropsType = {
  value?: ?string,
};

const SearchNoResults = (props: PropsType) => (
  <div styleName="container">
    <Icon type="searchNoResults" size={120} />
    <div
      styleName="text" /* eslint-disable */
      dangerouslySetInnerHTML={{
        /* eslint-enable */
        __html: `${t.sorryButNotResults}${
          !isNil(props.value)
            ? ` ${t.for} ‘<strong>${
                props.value
              }</strong>’. ${t.checkYourSearch}`
            : ''
        }.`,
      }}
    />
  </div>
);

SearchNoResults.defaultProps = {
  value: null,
};

export default SearchNoResults;
