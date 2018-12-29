// @flow strict

import React, { PureComponent } from 'react';

import classname from 'classnames';

import type { Node, Component } from 'react';

import { log } from 'utils';

import type { MarkType } from './Toolbar';

import AlignCenter from './svg/align-center.svg';
import AlignLeft from './svg/align-left.svg';
import AlignRight from './svg/align-right.svg';
import Bold from './svg/bold.svg';
import Image from './svg/image.svg';
import Italic from './svg/italic.svg';
import Justified from './svg/justified.svg';
import Link from './svg/link.svg';
import Table from './svg/table.svg';
import TextColor from './svg/text-color.svg';
import Text from './svg/text.svg';
import Underline from './svg/underline.svg';
import Video from './svg/video.svg';

import './MarkButton.scss';

type PropsType = {
  markType: MarkType,
  active: boolean,
  onClick: (markType: MarkType) => void,
  btnNode?: Node,
};

const iconsHashMap: { [MarkType]: Component<*> } = {
  align_center: <AlignCenter />,
  align_left: <AlignLeft />,
  align_right: <AlignRight />,
  bold: <Bold />,
  image: <Image />,
  italic: <Italic />,
  justified: <Justified />,
  link: <Link />,
  table: <Table />,
  text: <Text />,
  textColor: <TextColor />,
  underlined: <Underline />,
  video: <Video />,
};

const defaultIcon = 'insert_emoticon';

const getIcon = (markType: MarkType): Node => {
  if (process.env.BROWSER) {
    return iconsHashMap[markType] || defaultIcon;
  }
  return <div>[*]</div>;
};

class MarkButton extends PureComponent<PropsType> {
  
  handleClick = (evt:SyntheticEvent<HTMLButtonElement>): void => {
    const { onClick} = this.props;
    evt.preventDefault();
    log.debug('MarkButton::click', { type: this.props.markType });
    onClick(this.props.markType);
  }

  render() {
    const { btnNode, markType, active } = this.props;
    return (
      <button
        onClick={this.handleClick}
        styleName={classname('container', {
          isActive: active,
        })}
      >
        {btnNode || getIcon(markType)}
      </button>
    );
  }
}

export default MarkButton;
