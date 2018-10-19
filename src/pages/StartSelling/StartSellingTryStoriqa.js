// @flow strict

import React from 'react';
import { map } from 'ramda';

import { Row, Col } from 'layout';

import './StartSellingTryStoriqa.scss';

type PropsType = {
  lang: string,
};

const itemsEn: Array<{ id: string, title: string, text: string }> = [
  {
    id: '1',
    title: 'Personal manager',
    text:
      'We provide you with a&nbsp;personal manager that will help you craft high quality item descriptions as well as answer all of&nbsp;your questions to&nbsp;support you every step of&nbsp;the&nbsp;way.',
  },
  {
    id: '2',
    title: 'Payments in both cryptocurrency and fiat',
    text:
      'Did you know? Hundreds of&nbsp;crypto holders are ready to&nbsp;use crypto as a&nbsp;preferred method to&nbsp;traditional currency? We give the&nbsp;manufacturers the&nbsp;opportunity to&nbsp;receive their revenue in&nbsp;STQ, BTC, ETH, and other popular cryptocurrencies. Traditional payment forms such as&nbsp;USD, SGD, or&nbsp;RUR are available in&nbsp;select product lines.',
  },
  {
    id: '3',
    title:
      '3 months free of&nbsp;promotional credits and&nbsp;product support.<br />Seller Feedback is prioritized and gets rewawded in&nbsp;credits!',
    text:
      'We incentivize seller feedback, if&nbsp;you take the&nbsp;time to&nbsp;provide&nbsp;us input into your seller experiance you are rewarded with credits that you are able to&nbsp;use to&nbsp;list products for&nbsp;free.',
  },
];

const itemsRu: Array<{ id: string, title: string, text: string }> = [
  {
    id: '1',
    title: 'Персональный менеджер',
    text:
      'Мы предоставим вам персонального менеджера с&nbsp;опытом в&nbsp;продажах и&nbsp;маркетинге, который поможет сделать качественное описание магазина и&nbsp;товаров, ответит на&nbsp;все вопросы и&nbsp;подскажет, как увеличить продажи со&nbsp;Storiqa.',
  },
  {
    id: '2',
    title: 'Расчеты в&nbsp;традиционных валютах и&nbsp;криптовалютах',
    text:
      'Вы знали, что сотни тысяч держателей криптовалют по&nbsp;всему миру готовы платить ими? Мы&nbsp;дадим вам возможность первыми зарабатывать в&nbsp;STQ, ETH, BTC и&nbsp;других популярных криптовалютах! Кроме&nbsp;того, платформа будет поддерживать и&nbsp;традиционные валюты, такие как&nbsp;USD, RUR или&nbsp;SGD.',
  },
  {
    id: '3',
    title:
      '3 месяца бесплатно. Мы вам новых клиентов&nbsp;— вы&nbsp;нам обратную связь',
    text:
      'Хотите получить канал продаж, где вы&nbsp;расплачиваетесь не&nbsp;деньгами, а&nbsp;информацией? В&nbsp;течение трех&nbsp;месяцев наши первые магазины будут продавать товары без комиссий. В&nbsp;обмен мы&nbsp;просим лишь обратную связь и&nbsp;30&nbsp;минут вашего времени в&nbsp;день.',
  },
];

const StartSellingTryStoriqa = ({ lang }: PropsType) => (
  <div styleName="container">
    <h2
      styleName="title"
      /* eslint-disable */
      dangerouslySetInnerHTML={{
        /* eslint-disable */
        __html:
          lang === 'ru'
            ? 'Почему стоит начать сейчас?'
            : 'Why give Storiqa a&nbsp;shot?',
      }}
    />
    <p
      styleName="subtitle"
      /* eslint-disable */
      dangerouslySetInnerHTML={{
        /* eslint-disable */
        __html:
          lang === 'ru'
            ? 'Вместе с персональным менеджером вы&nbsp;выстроите персональную траекторию по&nbsp;маркетингу, увеличению продаж и&nbsp;поддержке клиентов.'
            : 'We deliver high quality services and support to&nbsp;our sellers, including marketing assistance and&nbsp;sales advice.',
      }}
    />
    <Row>
      <div styleName="items">
        {map(
          item => (
            <Col key={item.id} size={12}>
              <div styleName="item">
                <h4
                  styleName="itemTitle"
                  dangerouslySetInnerHTML={{ __html: item.title }} // eslint-disable-line
                />
                <p
                  styleName="itemText"
                  dangerouslySetInnerHTML={{ __html: item.text }} // eslint-disable-line
                />
              </div>
            </Col>
          ),
          lang === 'ru' ? itemsRu : itemsEn,
        )}
      </div>
    </Row>
  </div>
);

export default StartSellingTryStoriqa;
