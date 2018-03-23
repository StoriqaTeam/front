import React, { PureComponent, Fragment } from 'react';

import { SliderContainer } from 'components/Slider';
import { CardProduct } from 'components/CardProduct';
import { Banner } from 'components/Banner';

import './Slider.scss';

type PropsTypes = {
  items: Array<{}>,
  title: ?string,
  type: string,
};

class Slider extends PureComponent<PropsTypes> {
  render() {
    const { type } = this.props;
    return (
      <div styleName="container">
        <SliderContainer {...this.props}>
          {this.props.items.map(item => (
            <Fragment key={item.id}>
              {type === 'cardProduct' && <CardProduct data={item} />}
              {type === 'banners' && <Banner banner={item} />}
            </Fragment>
          ))}
        </SliderContainer>
      </div>
    );
  }
}

export default Slider;
