import ReactDOM from 'react-dom';
import buildApp from 'components/entry';
import { loadableReady } from '@loadable/component';

import { log } from 'utils';

import './windowModal';
import './index.scss';

/* eslint-disable promise/no-nesting */

if (process.env.BROWSER && buildApp) {
  buildApp()
    .then(App => {
      // $FlowIgnore
      if (process.env.NODE_ENV === 'development' && module.hot) {
        ReactDOM.render(App, document.getElementById('root'));
      } else {
        loadableReady(() => {
          const root = document.getElementById('main');
          ReactDOM.hydrate(App, root);
        });
      }
      // $FlowIgnore
      if (process.env.NODE_ENV === 'development' && module.hot) {
        module.hot.accept('./components/entry.js', () => {
          import('./components/entry.js')
            .then(newInstance => {
              const rebuildApp = newInstance.default;
              rebuildApp()
                .then(NewApp => {
                  ReactDOM.render(NewApp, document.getElementById('root'));
                  return true;
                })
                .catch(log.error);
              return true;
            })
            .catch(log.error);
        });
      }
      return true;
    })
    .catch(log.error);
}

/* eslint-enable promise/no-nesting */
