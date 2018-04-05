import * as React from 'react';

import './Tabs.scss';

type propsType = {
  selected?: number,
  children: React.Node,
}

type stateType = {
  selected: number,
}

class Tabs extends React.Component<propsType, stateType> {
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
  componentWillReceiveProps(nextProps) {
    if (nextProps.selected !== this.props.selected) {
      this.setState({
        selected: nextProps.selected,
      });
    }
  }
  /**
   * Set the selected's tabs index
   *
   * @param {SyntheticEvent} evt
   * @param {number} index
   * @return {void}
   */
  handleClick = (evt: SyntheticEvent, index: number): void => {
    evt.preventDefault();
    this.setState({
      selected: index,
    });
  };
  /**
   * Renders the tab's
   * @return {React.Node[]}
   */
  renderTitles = (): React.Node[] => {
    const { children } = this.props;
    const { selected } = this.state;
    /**
     * @param {React.Node} child
     * @param {number} index
     * @return {React.Node}
     */
    const buildLabels = (child: React.Node, index: number): React.Node => {
      const activeClass = selected === index ? 'active' : '';
      return (
        <div
          onKeyPress={e => e.preventDefault()}
          role="none"
          key={index}
          styleName={`label ${activeClass}`}
          onClick={e => this.handleClick(e, index)}
        >
          <span>
            {child.props.label}
          </span>
        </div>
      );
    };
    return (
      <div styleName="labels">
        { children.map(buildLabels) }
      </div>
    );
  };

  /**
   * Renders the tab's content
   *
   * @return {React.Node}
   */
  renderContent = (): React.Node => {
    const { selected } = this.state;
    return (
      <div styleName="sisa">
        {this.props.children[selected]}
      </div>
    );
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
