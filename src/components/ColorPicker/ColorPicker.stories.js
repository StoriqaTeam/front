import React from 'react';
import { storiesOf } from '@storybook/react';

import ColorPicker from './ColorPicker';

class ColorPickerWrapper extends React.Component {
  state = {
    value: null,
  }

  handleOnChange = (value) => {
    this.setState({ value });
  }

  render() {
    const { value } = this.state;
    return (
      <div style={{ width: 200 }}>
        <ColorPicker
          onSelect={this.handleOnChange}
          items={[ '#333333', 'red', 'blue', 'green', '#000000' ]}
          value={value}
        />
      </div>
    )
  }
}

storiesOf('ColorPicker', module)
  .add('simple example', () => (
    <ColorPickerWrapper />
  ));
