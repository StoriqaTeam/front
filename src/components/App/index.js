import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class App extends PureComponent {
  static defaultProps = {
    someData: 'test',
  };

  render() {
    const { someData } = this.props;
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Mainpage here</h1>
        </header>
        <p className="App-intro">{someData}</p>
      </div>
    );
  }
}

App.propTypes = {
  someData: PropTypes.string,
};


export default App;
