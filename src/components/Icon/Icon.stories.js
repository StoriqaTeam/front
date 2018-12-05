import React from 'react';
import { storiesOf } from '@storybook/react';

import { Icon, iconNames } from 'components/Icon';

storiesOf('Icons', module)
  .add('All', () => (
    <div>
      {iconNames.map((icon) => 
       <div><Icon type={icon} size="32" /><br />{icon}</div>
      )
      }
    </div>
  ));

