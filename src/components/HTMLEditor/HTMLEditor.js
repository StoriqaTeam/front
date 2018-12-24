// @flow strict

import React, { Component } from 'react';
import { Editor } from 'slate-react';
import { Value } from 'slate';

type PropsType = {
  //
};

type StateType = {
  value: {},
};

const initialValue = Value.fromJSON({
  document: {
    nodes: [
      {
        object: 'block',
        type: 'paragraph',
        nodes: [
          {
            object: 'text',
            leaves: [
              {
                text: 'Place your description here...',
              },
            ],
          },
        ],
      },
    ],
  },
});

class HTMLEditor extends Component<PropsType, StateType> {
  state = {
    value: initialValue,
  };

  onChange = ({ value }) => {
    this.setState({ value });
  };

  render() {
    return <Editor value={this.state.value} onChange={this.onChange} />;
  }
}

export default HTMLEditor;
