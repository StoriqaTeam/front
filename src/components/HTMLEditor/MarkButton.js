// @flow strict

import React from 'react';
import classname from 'classnames';

import type { Node } from 'react';

import { log } from 'utils';

import type { MarkType } from './Toolbar';

import './MarkButton.scss';

type PropsType = {
  markType: MarkType,
  isActive: boolean,
  onClick: (markType: MarkType) => void,
  btnNode?: Node,
};

const iconsHashMap: { [MarkType]: string } = {
  bold: 'format_bold',
  italic: 'format_italic',
  underlined: 'format_underlined',
  align_left: 'format_align_left',
  align_center: 'format_align_center',
  align_right: 'format_align_right',
  link: 'insert_link',
  image: 'insert_photo',
  video: 'ondemand_video',
};

const defaultIcon = 'insert_emoticon';

const getIcon = (markType: MarkType): Node => {
  // dirty hack. material-icons-react crashes build on server side.
  if (process.env.BROWSER) {
    const MaterialIcon = require('material-icons-react').default; // eslint-disable-line
    return <MaterialIcon icon={iconsHashMap[markType] || defaultIcon} />;
  }
  return <div>[*]</div>;
};

class MarkButton extends React.PureComponent<PropsType> {
  componentDidMount() {
    //
  }

  render() {
    return (
      <button
        onClick={event => {
          event.preventDefault();
          log.debug('MarkButton::click', { type: this.props.markType });
          this.props.onClick(this.props.markType);
        }}
        styleName={classname({ isActive: this.props.isActive })}
      >
        {this.props.btnNode || getIcon(this.props.markType)}
      </button>
    );
  }
}

export default MarkButton;
