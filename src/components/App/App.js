import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { changeWithValue } from 'redux/reducers/dummy';
import { SignUpForm } from 'components/SignUpForm';

class App extends PureComponent {
  handleBtnClick = () => this.props.changeValue('asdf');

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Mainpage here</h1>
        </header>
        <SignUpForm />
      </div>
    );
  }
}

App.propTypes = {
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
