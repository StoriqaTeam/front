import { Environment, Network, RecordSource, Store } from 'relay-runtime';
import { Resolver } from 'found-relay';
import { installRelayDevTools } from 'relay-devtools'; // eslint-disable-line

const createResolver = (fetcher) => {
  if (process.env.NODE_ENV !== 'production') {
    // installRelayDevTools();
  }
  const environment = new Environment({
    network: Network.create((...args) => fetcher.fetch(...args)),
    store: new Store(new RecordSource()),
  });

  return new Resolver(environment);
};

export default createResolver;
