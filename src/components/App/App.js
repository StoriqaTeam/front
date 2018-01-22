import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'found';

import { changeWithValue } from 'redux/reducers/dummy';
import { Button } from 'components/Button';

class App extends PureComponent {
  handleBtnClick = () => this.props.changeValue('asdf');

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">{`Mainpage here (${this.props.apiVersion})`}</h1>
        </header>
        {!this.props.inChanging && (
          <Button
            title="Press me"
            onClick={this.handleBtnClick}
          />
        )}
        <br />
        <br />
        <Link to="/login" >Login</Link>
      </div>
    );
  }
}

App.defaultProps = {
  apiVersion: '',
  inChanging: false,
};

App.propTypes = {
  apiVersion: PropTypes.string,
  inChanging: PropTypes.bool,
  changeValue: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  inChanging: state.dummy.inChanging,
});

const mapDispatchToProps = ({
  changeValue: changeWithValue,
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
