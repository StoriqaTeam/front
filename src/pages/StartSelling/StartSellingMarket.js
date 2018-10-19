// @flow

import React from 'react';

import { Row, Col } from 'layout';

import computerImage from './img/storiqa-computer-market.png';

import './StartSellingMarket.scss';

type PropsType = {
  lang: string,
};

const StartSellingMarket = ({ lang }: PropsType) => (
  <div styleName="container">
    <h2
      styleName="title"
      /* eslint-disable */
      dangerouslySetInnerHTML={{
        /* eslint-enable */
        __html:
          lang === 'ru'
            ? 'Storiqa дает возможность продавать ваши товары в&nbsp;Сингапуре уже сейчас'
            : 'Storiqa gives you an&nbsp;opportunity to&nbsp;sell all around the&nbsp;globe. Launching with select countries now!',
      }}
    />
    <p
      styleName="subtitle"
      /* eslint-disable */
      dangerouslySetInnerHTML={{
        /* eslint-enable */
        __html:
          lang === 'ru'
            ? 'Наша цель&nbsp;— предоставить высококлассный сервис продавцу и&nbsp;гарантировать наивысшее качество товаров покупателю.'
            : 'We guarantee quality experience for both buyers and&nbsp;sellers.',
      }}
    />
    <Row>
      <Col size={12} sm={12} md={6} lg={6} xl={6}>
        <article styleName="parragraphs">
          <p
            /* eslint-disable */
            dangerouslySetInnerHTML={{
              /* eslint-enable */
              __html:
                lang === 'ru'
                  ? 'Storiqa&nbsp;— это онлайн-маркетплейс, который предлагает производителям из&nbsp;России, Сингапура, Малайзии, Индонезии и&nbsp;Тайланда создать магазин на&nbsp;платформе и&nbsp;продавать свои товары в&nbsp;странах APAC: на&nbsp;первом этапе&nbsp;— в&nbsp;Сингапуре, и&nbsp;количество доступных стран будет увеличиваться.'
                  : 'Currently accepting sellers from Singapore and&nbsp;Russia. Up&nbsp;next Malaysia, Indonesia, and&nbsp;Thailand.',
            }}
          />
          <p
            /* eslint-disable */
            dangerouslySetInnerHTML={{
              /* eslint-enable */
              __html:
                lang === 'ru'
                  ? 'Мы ищем производителей товаров ручной работы или мелкосерийные производства. Если вы&nbsp;создаете красивые, уникальные и&nbsp;вдохновляющие вещи&nbsp;— найдите новую аудиторию вместе с&nbsp;нами!'
                  : 'We are inviting small-scale producers of&nbsp;craft and tailor made goods. If you are creating unique, wonderfully made, great quality goods&nbsp;— apply today.',
            }}
          />
        </article>
      </Col>
      <Col size={12} sm={12} md={6} lg={6} xl={6}>
        <div styleName="imageContainer">
          <img src={computerImage} alt="storiqa market" />
        </div>
      </Col>
    </Row>
  </div>
);

export default StartSellingMarket;
