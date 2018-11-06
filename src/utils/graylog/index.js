// @flow strict

// $FlowIgnoreMe
import graylog from 'gelf-pro';

const logger = graylog.setConfig({
  host: 'graylog-tcp.internal.stq.cloud',
  fields: {
    cluster: `${process.env.GRAYLOG_CLUSTER || 'localhost'}`,
    type: 'ssr',
    source_type: 'frontend',
  },
  adapterName: 'tcp',
  adapterOptions: {
    host: 'graylog-tcp.internal.stq.cloud',
    port: 12201,
    family: 4,
    timeout: 1000,
  },
});

export default logger;
