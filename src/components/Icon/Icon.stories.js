import React from 'react';
import { storiesOf } from '@storybook/react';

import { Icon, iconNames } from 'components/Icon';
import { select, withKnobs } from '@storybook/addon-knobs';

const label = 'size';
const options = {
  "8": "8",
  "12": "12",    
  "16": "16",
  "20": "20",
  "24": "24",    
  "28": "28",
  "32": "32",
  "36": "36",
  "40": "40",
  "48": "48",
  "56": "56",
  "80": "80",
  "120": "120",
};
const defaultValue = "32";

storiesOf('Icons', module)
  .addDecorator(withKnobs)
  .add('All', () => (
    <div>
      {iconNames.map((icon) => 
       <div><Icon type={icon} size={select(label, options, defaultValue)} /><br />{icon}</div>
      )
      }
    </div>
  ));

  