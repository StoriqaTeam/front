// @flow

import * as React from 'react';

import './Tabs.scss';

type PropsType = {
  selected: number,
  children: Array<React.Node>,
};

type StateType = {
  selected: number,
};

class Tabs extends React.Component<PropsType, StateType> {
  /**
   * @static
   * @type {{selected: number}}
   */
  static defaultProps = {
    selected: 0,
  };
  state = {
    selected: this.props.selected,
  };
  componentWillReceiveProps(nextProps: PropsType) {
    if (nextProps.selected !== this.props.selected) {
      this.setState({
        selected: nextProps.selected,
      });
    }
  }
  /**
   * Set the selected's tabs index
   *
   * @param {any} evt
   * @param {number} index
   * @return {void}
   */
  handleClick = (evt: any, index: number): void => {
    evt.preventDefault();
    this.setState({
      selected: index,
    });
  };
  /**
   * Renders the tab's
   * @return {React.Element<any>}
   */
  renderTitles = (): React.Element<any> => {
    const { children } = this.props;
    const { selected } = this.state;
    /**
     * @param {React.Node} child
     * @param {number} index
     * @return {React.Node}
     */
    const buildLabels = (child: any, index: number) => {
      const activeClass = selected === index ? 'active' : '';
      return (
        <div
          onKeyPress={e => e.preventDefault()}
          role="none"
          key={index}
          styleName={`label ${activeClass}`}
          onClick={e => this.handleClick(e, index)}
        >
          <span>{child.props.label}</span>
        </div>
      );
    };
    return <div styleName="labels">{children.map(buildLabels)}</div>;
  };

  /**
   * Renders the tab's content
   *
   * @return {React.Node}
   */
  renderContent = (): React.Node => {
    const { selected } = this.state;
    return <div>{this.props.children[selected]}</div>;
  };

  render() {
    return (
      <div styleName="container">
        {this.renderTitles()}
        {this.renderContent()}
      </div>
    );
  }
}

export default Tabs;
