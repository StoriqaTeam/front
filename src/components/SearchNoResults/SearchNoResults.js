// @flow strict

import React from 'react';
import { isNil } from 'ramda'
import { Icon } from 'components/Icon';

import './SearchNoResults.scss';

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
        __html: `Sorry, but no results${
          !isNil(props.value)
            ? ` for ‘<strong>${
                props.value
              }</strong>’. Check your search request for mistakes or try to find somethind else.`
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
