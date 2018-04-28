import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class ProgressBar extends PureComponent {
  static defaultProps = {
    max: 100,
    percentage: 0,
    message: '',
    qualityClass: '',
  };

  render() {
    // eslint-disable-next-line
    const { message, percentage, max, qualityClass } = this.props;
    return (
      <div className="progressBarWrapper">
        <progress
          className={`progressBar ${qualityClass}`}
          max={max}
          value={percentage}
        />
        <span className={`progressBarMessage ${qualityClass}`}>{message}</span>
      </div>
    );
  }
}

ProgressBar.propTypes = {
  max: PropTypes.number,
  percentage: PropTypes.number,
  message: PropTypes.string,
  qualityClass: PropTypes.string,
};

export default ProgressBar;
