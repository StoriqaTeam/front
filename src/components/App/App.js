import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { changeWithValue } from 'redux/reducers/dummy';
import { Button } from 'components/Button';
import { SignUpForm } from 'components/SignUpForm';

class App extends PureComponent {
  static defaultProps = {
    inChanging: false,
  };
  handleBtnClick = () => this.props.changeValue('asdf');

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Mainpage here</h1>
        </header>
        <SignUpForm />
        {!this.props.inChanging && (
          <Button
            title="Press me"
            onClick={this.handleBtnClick}
          />
        )}
      </div>
    );
  }
}

App.propTypes = {
  inChanging: PropTypes.bool,
  changeValue: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  inChanging: state.dummy.inChanging,
});

const mapDispatchToProps = ({
  changeValue: changeWithValue,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
