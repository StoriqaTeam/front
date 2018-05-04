import ReactDOM from 'react-dom';

import buildApp from 'components/entry';

import './index.scss';

if (process.env.BROWSER && buildApp) {
  buildApp().then(App => {
    if (process.env.NODE_ENV === 'development' && module.hot) {
      ReactDOM.render(App, document.getElementById('root'));
    } else {
      ReactDOM.hydrate(App, document.getElementById('root'));
    }
    if (process.env.NODE_ENV === 'development' && module.hot) {
      module.hot.accept('./components/entry.js', () => {
        import('./components/entry.js').then(newInstance => {
          const rebuildApp = newInstance.default;
          rebuildApp().then(NewApp => {
            ReactDOM.render(NewApp, document.getElementById('root'));
          });
        });
      });
    }
  });
}
