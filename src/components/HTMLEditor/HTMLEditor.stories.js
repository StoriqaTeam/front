import React from 'react';
import { storiesOf } from '@storybook/react';

import { HTMLEditor } from './index';

storiesOf('HTMLEditor', module)
.add('Default', () => (
    <HTMLEditor />
))
