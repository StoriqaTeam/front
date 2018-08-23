import React from 'react';
import { storiesOf } from '@storybook/react';

import { RadioButton } from 'components/common/RadioButton';

class RadioStory extends React.Component {
  state = {
    first: true,
    second: false,
  }

  handleOnChange = (item: string) => {
    this.setState(prevState => ({
      [item]: !prevState[item],
    }));
  }

  render() {
    const { first, second } = this.state;
    return (
      <div style={{ width: '300px' }}>
        <RadioButton
          label="Katya Ivanova Katya Ivanova Ivanova Katya Ivanova Ivanova Katya Ivanova Ivanova Katya Ivanova Ivanova Katya Ivanova Ivanova Katya Ivanova"
          isChecked={first}
          onChange={() => this.handleOnChange('first')}
        />
        <RadioButton
          label="Katya Ivanova"
          isChecked={second}
          onChange={() => this.handleOnChange('second')}
        />
      </div>
    );
  }
}

storiesOf('Common/RadioButton', module)
  .add('Default radio button', () => (
    <RadioStory />
  ));
