import React from 'react';
import { storiesOf } from '@storybook/react';

import { StoriesDecorator } from 'components/StoriesDecorator';
import { Icon } from 'components/Icon';

storiesOf('Icons', module)
  .add('Person', () => (
    <StoriesDecorator type="icons">
      <div><Icon type="person" size="32" /><br />person</div>
      <div><Icon type="cart" size="32" /><br />cart</div>
      <div><Icon type="prev" size="32" /><br />prev</div>
      <div><Icon type="next" size="32" /><br />next</div>
      <div><Icon type="qa" size="32" /><br />qa</div>
      <div><Icon type="eye" size="32" /><br />eye</div>
      <div><Icon type="eyeBlue" size="32" /><br />eyeBlue</div>
      <div><Icon type="spiner" size="32" /><br />spiner</div>
      <div><Icon type="facebook" size="32" /><br />facebook</div>
      <div><Icon type="google" size="32" /><br />google</div>
    </StoriesDecorator>
  ));
