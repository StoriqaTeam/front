import createInitialBrowserRouter from 'found/lib/createInitialBrowserRouter';
import createRender from 'found/lib/createRender';
import makeRouteConfig from 'found/lib/makeRouteConfig';
import React from 'react';
import ReactDOM from 'react-dom';

import './index.scss';
import routes from './routes';

(async () => {
  const BrowserRouter = await createInitialBrowserRouter({
    routeConfig: makeRouteConfig(routes),
    render: createRender({
      renderError: ({ error }) => ( // eslint-disable-line react/prop-types
        <div>
          {error.status === 404 ? 'Not found' : 'Error'}
        </div>
      ),
    }),
  });

  ReactDOM.render(
    <BrowserRouter />,
    document.getElementById('root'),
  );
})();
