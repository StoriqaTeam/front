import React from 'react';
import { storiesOf } from '@storybook/react';

import { Button } from 'components/Button';

storiesOf('Button', module)
  .add('with text', () => (
    <div
      style={{
        margin: '50px',
      }}
    >
      <Button
        title="Start Selling"
        onClick={() => {}}
      />
    </div>
  ));
