import React, { PureComponent } from 'react';

import classname from 'classnames';

import type { Node, Component } from 'react';

import { log } from 'utils';

import AlignCenter from './svg/align-center.svg';
import AlignJustify from './svg/align-justify.svg';
import AlignLeft from './svg/align-left.svg';
import AlignRight from './svg/align-right.svg';
import Bold from './svg/bold.svg';
import BulletedList from './svg/bulleted-list.svg';
import Image from './svg/image.svg';
import Italic from './svg/italic.svg';
import Link from './svg/link.svg';
import NumberedList from './svg/numbered-list.svg';
import Table from './svg/table.svg';
import Text from './svg/text.svg';
import TextColor from './svg/text-color.svg';
import Underline from './svg/underline.svg';
import Video from './svg/video.svg';

import './MarkButton.scss';

import type { MarkType } from './types';

type PropsType = {
  markType: MarkType,
  active: boolean,
  onClick: (markType: MarkType) => void,
  btnNode?: Node,
};

const iconsHashMap: { [MarkType]: Component<*> } = {
  align_center: <AlignCenter />,
  align_justify: <AlignJustify />,
  align_left: <AlignLeft />,
  align_right: <AlignRight />,
  bold: <Bold />,
  bulleted_list: <BulletedList />,
  image: <Image />,
  italic: <Italic />,
  link: <Link />,
  numbered_list: <NumberedList />,
  table: <Table />,
  text: <Text />,
  textColor: <TextColor />,
  underlined: <Underline />,
  video: <Video />,
};

const defaultIcon = 'insert_emoticon';

const getIcon = (markType: MarkType): Node =>
  iconsHashMap[markType] || defaultIcon;

class MarkButton extends PureComponent<PropsType> {
  handleClick = (evt: SyntheticEvent<HTMLButtonElement>): void => {
    const { onClick } = this.props;
    evt.preventDefault();
    log.debug('MarkButton::click', { type: this.props.markType });
    onClick(this.props.markType);
  };

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
