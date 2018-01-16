import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { Button } from 'components/Button';

class App extends PureComponent {
  handleBtnClick = () => {};

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">{`Mainpage here (${this.props.apiVersion})`}</h1>
        </header>
        <Button
          title="Press me"
          onClick={this.handleBtnClick}
        />
      </div>
    );
  }
}

App.defaultProps = {
  apiVersion: '',
};

App.propTypes = {
  apiVersion: PropTypes.string,
};

export default App;
