import React, { Component } from 'react';

export default OriginalComponent =>
  class HandlerDropdownDecorator extends Component {
    state = {
      isContentOpen: false,
    };

    componentWillMount() {
      if (process.env.BROWSER) {
        document.addEventListener('click', this.handleDropdown);
        document.addEventListener('keydown', this.handleDropdown);
      }
    }

    componentWillUnmount() {
      if (process.env.BROWSER) {
        document.removeEventListener('click', this.handleDropdown);
        document.removeEventListener('keydown', this.handleDropdown);
      }
    }

    handleDropdown = e => {
      const { localName } = e.target;
      const { isContentOpen } = this.state;
      const isTriggerClick =
        this.triggerElement && this.triggerElement.contains(e.target);
      const isContentClick =
        this.contentElement && this.contentElement.contains(e.target);

      if (isTriggerClick && !isContentOpen) {
        this.setState({ isContentOpen: true });
        return;
      }

      if (
        e.keyCode === 27 ||
        !isContentClick ||
        (localName && localName === 'a')
      ) {
        this.setState({ isContentOpen: false });
      }
    };

    render() {
      return (
        <OriginalComponent
          triggerRef={el => {
            this.triggerElement = el;
          }}
          contentRef={el => {
            this.contentElement = el;
          }}
          {...this.props}
          {...this.state}
          handleDropdown={this.handleDropdown}
        />
      );
    }
  };
