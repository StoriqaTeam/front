// @flow

import React from 'react';
import { storiesOf } from '@storybook/react';

import { SearchInput } from 'components/SearchInput';

storiesOf('Search input', module)
  .add('Default', () => (
    <div style={{ marginTop: 50, marginLeft: 50 }}>
      <SearchInput />
    </div>
  ));
