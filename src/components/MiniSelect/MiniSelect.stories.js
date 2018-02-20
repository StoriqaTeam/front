import React from 'react';
import { storiesOf } from '@storybook/react';

import { MiniSelect } from 'components/MiniSelect';
import { log } from 'utils';

storiesOf('MiniSelect', module)
  .add('Currency', () => (
    <MiniSelect
      items={[
        { id: '1', label: 'BTC' },
        { id: '2', label: 'ETH' },
        { id: '3', label: 'STQ' },
        { id: '4', label: 'ADA' },
        { id: '5', label: 'NEM' },
        { id: '6', label: 'STRAT' },
      ]}
      onSelect={(selected: { id: string, label: string }) => {
        log.debug('onSelect', JSON.stringify(selected));
      }}
    />
  ))
  .add('Currency in product', () => (
    <MiniSelect
      isItem
      items={[
        { id: '1', label: 'BTC' },
        { id: '2', label: 'ETH' },
        { id: '3', label: 'STQ' },
        { id: '4', label: 'ADA' },
        { id: '5', label: 'NEM' },
        { id: '6', label: 'STRAT' },
      ]}
      onSelect={(selected: { id: string, label: string }) => {
        log.debug('onSelect', JSON.stringify(selected));
      }}
    />
  ))
  .add('Menu', () => (
    <MiniSelect
      isDropdown
      label="Dropdown"
      items={[
        { id: '1', label: 'Punkt #1' },
        { id: '2', label: 'Delivery' },
        { id: '3', label: 'Quality Assurance' },
      ]}
    />
  ));
