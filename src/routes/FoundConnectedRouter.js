import React from 'react';
import { createRender, createConnectedRouter } from 'found/lib';

const FoundConnectedRouter = createConnectedRouter({
  render: createRender({
    renderError: ({ error }) => ( // eslint-disable-line
      <div>
        {error.status === 404 ? 'Not found' : 'Error'}
      </div>
    ),
  }),
});

export default FoundConnectedRouter;
