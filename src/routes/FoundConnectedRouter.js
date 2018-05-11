// @flow

import React from 'react';
import { createRender, createConnectedRouter } from 'found/lib';

import { Error404, Error } from 'pages/Errors';

const FoundConnectedRouter = createConnectedRouter({
  render: createRender({
    renderError: (
      { error }, // eslint-disable-line
    ) => <div>{error.status === 404 ? <Error404 /> : <Error />}</div>,
  }),
});

export default FoundConnectedRouter;
