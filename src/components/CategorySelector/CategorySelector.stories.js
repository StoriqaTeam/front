// @flow

import React from 'react';
import { storiesOf } from '@storybook/react';

import { CategorySelector } from 'components/CategorySelector';
import { log } from 'utils';

import categories from './categories.json';

storiesOf('CategorySelector', module)
  .add('Default', () => (
    <CategorySelector
      categories={categories}
      onSelect={categoryId => log.info(categoryId)}
    />
  ));

