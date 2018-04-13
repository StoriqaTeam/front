// @flow

import React from 'react';
import type { Node } from 'react';

type PropsType = {
  children: Node,
}

const Sidebar = ({ children }: PropsType) => (
  <div>
    {children}
  </div>
);

export default Sidebar;
