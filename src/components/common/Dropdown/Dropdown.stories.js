import React from 'react';
import { storiesOf } from '@storybook/react';

import { Dropdown } from 'components/common/Dropdown';
import { log } from 'utils';

storiesOf('Common/Dropdown', module)
  .add('Default', () => (
    <Dropdown
      items={[
        { id: '1', label: 'Menu item #1' },
        { id: '2', label: 'Menu item #2' },
        { id: '3', label: 'Menu item #3' },
        { id: '4', label: 'Menu item #4' },
        { id: '5', label: 'Menu item #5' },
        { id: '6', label: 'Menu item #6' },
      ]}
      activeItem={{ id: '1', label: 'BTC' }}
      onSelect={(selected: { id: string, label: string }) => {
        log.debug('onSelect', JSON.stringify(selected));
      }}
    />
  ));
