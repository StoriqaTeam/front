// @flow

import { Environment, Network, RecordSource, Store } from 'relay-runtime';
import { Resolver } from 'found-relay';
// import { installRelayDevTools } from 'relay-devtools'; // eslint-disable-line

// installRelayDevTools();

let environment; // eslint-disable-line
const createResolver = (fetcher: { fetch: () => void }) => {
  if (process.env.NODE_ENV !== 'production') {
    // installRelayDevTools();
  }
  environment = new Environment({
    network: Network.create((...args) => fetcher.fetch(...args)),
    store: new Store(new RecordSource()),
  });
  return new Resolver(environment);
};
export { environment };

export default createResolver;
