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
            : 'Storiqa give you the opportunity to&nbsp;sell your goods in&nbsp;Singapore today',
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
            : 'Our goal is to guarantee the&nbsp;quality of&nbsp;experience and goods, for both buyers and&nbsp;sellers.',
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
                  : 'Storiqa is an&nbsp;marketplace which offer sellers from Singapore, Thailand, Malasia, Indonesia and Russia create their shop on&nbsp;Storiqa now and start selling their goods to the APAC countries. For the first step Storiqa will support Singapore only and every month we will add more and more contries.',
            }}
          />
          <p
            /* eslint-disable */
            dangerouslySetInnerHTML={{
              /* eslint-enable */
              __html:
                lang === 'ru'
                  ? 'Мы ищем производителей товаров ручной работы или мелкосерийные производства. Если вы&nbsp;создаете красивые, уникальные и&nbsp;вдохновляющие вещи&nbsp;— найдите новую аудиторию вместе с&nbsp;нами!'
                  : 'We are inviting small-scale producers of&nbsp;craft and tailor made goods. If it is you and you are creating unique, good quality and wonderful goods&nbsp;— apply our program today.',
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
