// @flow

import * as React from 'react';

export type TabType = {
  id: string,
  label: string,
  content: React.Node | React.Component<any, any> | string,
};
