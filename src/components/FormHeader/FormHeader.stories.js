import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, text } from '@storybook/addon-knobs/react';

import { FormHeader } from 'components/FormHeader';

storiesOf('FormHeader', module)
  .addDecorator(withKnobs)
  .add('with default "title" and "linkTitle"', () => {
    const title = text('title', 'I\'m a title');
    const linkTitle = text('linkTitle', 'click me');
    return (
      <FormHeader
        title={title}
        linkTitle={linkTitle}
      />
    );
  });
