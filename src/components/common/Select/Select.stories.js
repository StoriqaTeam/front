import React from 'react';
import { storiesOf } from '@storybook/react';

import { Select } from 'components/common/Select';
import { log } from 'utils';

storiesOf('Common/Select', module)
  .add('Currency', () => (
    <Select
      items={[
        { id: '1', label: 'BTC' },
        { id: '2', label: 'ETH' },
        { id: '3', label: 'STQ' },
        { id: '4', label: 'ADA' },
        { id: '5', label: 'NEM' },
        { id: '6', label: 'STRAT' },
      ]}
      activeItem={{ id: '1', label: 'BTC' }}
      onSelect={(selected: { id: string, label: string }) => {
        log.debug('onSelect', JSON.stringify(selected));
      }}
    />
  ))
  .add('Currency in product', () => (
    <Select
      isItem
      items={[
        { id: '1', label: 'BTC' },
        { id: '2', label: 'ETH' },
        { id: '3', label: 'STQ' },
        { id: '4', label: 'ADA' },
        { id: '5', label: 'NEM' },
        { id: '6', label: 'STRAT' },
      ]}
      activeItem={{ id: '1', label: 'BTC' }}
      onSelect={(selected: { id: string, label: string }) => {
        log.debug('onSelect', JSON.stringify(selected));
      }}
    />
  ));
