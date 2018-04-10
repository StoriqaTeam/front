// @flow

import ReactDOM from 'react-dom';

import buildApp from 'components/entry';

import './index.scss';

buildApp()
  .then((App) => {
    // $FlowIgnore
    ReactDOM.hydrate(App, document.getElementById('root'));
    if (process.env.NODE_ENV === 'development' && module.hot) {
      // $FlowIgnore
      module.hot.accept('./components/entry.js', () => {
        import('./components/entry.js')
          .then((newInstance) => {
            const rebuildApp = newInstance.default;
            rebuildApp()
              .then((NewApp) => {
                // $FlowIgnore
                ReactDOM.hydrate(NewApp, document.getElementById('root'));
              });
          });
      });
    }
  });
