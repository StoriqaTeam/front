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
      'We will provide you with the personal account manager that will help you to&nbsp;make a&nbsp;high quality description for your items answer all of&nbsp;your questions and support you on&nbsp;every step.',
  },
  {
    id: '2',
    title: 'Payments both in cryptocurrency and fiat',
    text:
      'Did you know that hundreds of&nbsp;crypto holders are ready to&nbsp;use&nbsp;them as the&nbsp;real paying currency? We will give the manufacturers the opportunity to&nbsp;receive their revenue in&nbsp;STQ, BTC, ETH and other popular cryptocurrencies. More of&nbsp;that, standard fiat currencies such as&nbsp;USD, SGD or&nbsp;RUR would also be available for special items categories.',
  },
  {
    id: '3',
    title:
      '3 months free product support and promotion.<br />You give us feedback&nbsp;— we give you clients',
    text:
      'Do you have a selling channel paid by the information? During the limited period our first sellers will use our services for free. All you need to&nbsp;do is give us feedback and spend 30&nbsp;minutes a&nbsp;day.',
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
      '3 месяца бесплатно.<br />Мы вам новых клиентов&nbsp;— вы&nbsp;нам обратную связь',
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
            : 'Why should you try Storiqa?',
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
            : 'We deliver high quality services and support, including marketing assistance and sales advice.',
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
