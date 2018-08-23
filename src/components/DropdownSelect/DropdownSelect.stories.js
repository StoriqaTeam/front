import React from 'react';
import { storiesOf } from '@storybook/react';

import { DropdownSelect } from 'components/DropdownSelect';
import { log } from 'utils';

storiesOf('DropdownSelect', module)
  .add('Search categories', () => (
    <div style={{ margin: 50, width: 100, position: 'relative' }}>
      <DropdownSelect
        namePrefix="search"
        items={[
          { id: 1, label: 'Shops' },
          { id: 2, label: 'Products' },
          { id: 3, label: 'All' },
        ]}
        onDropdownSelect={(id: number) => {
          log.debug('onDropdownSelect', JSON.stringify({ id }));
        }}
      />
    </div>
  ));
