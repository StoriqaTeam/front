import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

class Slider extends PureComponent {
  static defaultProps = {
    onClick: () => {},
  };

  render() {
    const { title, color } = this.props;
    return (
      <div className="Slider">
        <div className="Slider--title" style={{color}}>{title}</div>
        <div className="Slider--nav">
          <button type="button" className="Slider--nav--button Slider--nav--button-prev">
            <img src="../../assets/img/prev-button.svg" alt="prev" />
          </button>
          <button type="button" className="Slider--nav--button Slider--nav--button-next">
            <img src="../../assets/img/prev-button.svg" alt="next" />
          </button>
        </div>
        <div className="Slider--reveal" style={{color}}>See all</div>
        <div className="Slider--wrapper">
          <div className="Slider--wrapper--slide">...</div>
          <div className="Slider--wrapper--slide">...</div>
          <div className="Slider--wrapper--slide">...</div>
          <div className="Slider--wrapper--slide">...</div>
        </div>
      </div>
    );
  }
}

export default Slider;
