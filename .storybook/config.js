import React from 'react';
import { configure, addDecorator } from '@storybook/react';
import { StoriesDecorator } from './StoriesDecorator';

import '../src/index.scss';

const req = require.context('../src', true, /\.stories\.js$/);

addDecorator((story, param) => {
  return <StoriesDecorator children={story()} kind={param.kind} />;
});

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
