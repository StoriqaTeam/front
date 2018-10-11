// @flow

import React from 'react';
import { map } from 'ramda';

import { Row, Col } from 'layout';

import forSellersImage from './img/storiqa-for-sellers.png';

import './StartSellingForSellers.scss';

type PropsType = {
  lang: string,
};

const itemsEn: Array<{ id: string, title: string, text: string }> = [
  {
    id: '1',
    title: 'Delivery',
    text:
      'Right after payment are only two&nbsp;things have to&nbsp;be done from seller side&nbsp;— pack good and give it to&nbsp;the&nbsp;delivery man.',
  },
  {
    id: '2',
    title: 'Processing',
    text:
      'Every seller could choose which exact currency suit him with every particular good. You can relay on&nbsp;us with&nbsp;that.',
  },
  {
    id: '3',
    title: 'Marketing',
    text:
      'Your personal manager stays in touch with our marketing department and will help to&nbsp;develop a&nbsp;strict and effective plan on «how to&nbsp;sell your goods on&nbsp;Singaporean market»',
  },
];

const itemsRu: Array<{ id: string, title: string, text: string }> = [
  {
    id: '1',
    title: 'Занимаемся доставкой',
    text:
      'После оплаты заказа покупателем вам требуется только наклеить этикетку на&nbsp;товар и&nbsp;отдать его курьеру.',
  },
  {
    id: '2',
    title: 'Обеспечиваем процессинг платежей',
    text:
      'Вы можете продавать товары за&nbsp;любую доступную валюту. Все хлопоты по&nbsp;процессингу мы&nbsp;берем на&nbsp;себя.',
  },
  {
    id: '3',
    title: 'Даем маркетинговое сопровождение',
    text:
      'Ваш персональный менеджер совместно с&nbsp;отделом маркетинга разработает и&nbsp;поможет реализовать детальный план по&nbsp;продвижению именно ваших товаров на&nbsp;Сингапурском рынке.',
  },
];

const StartSellingForSellers = ({ lang }: PropsType) => (
  <div styleName="container">
    <Row>
      <Col size={12} sm={12} md={6} lg={6} xl={6}>
        <h2
          styleName="title"
          /* eslint-disable */
          dangerouslySetInnerHTML={{
            /* eslint-enable */
            __html:
              lang === 'ru'
                ? 'Storiqa&nbsp;— настоящий швейцарский нож для&nbsp;продавцов'
                : 'Storiqa is a&nbsp;real swiss army knife for&nbsp;sellers',
          }}
        />
        <p
          styleName="subtitle"
          /* eslint-disable */
          dangerouslySetInnerHTML={{
            /* eslint-enable */
            __html:
              lang === 'ru'
                ? 'С нашей помощью вы&nbsp;сможете эффективно управлять продажами по&nbsp;всему миру.'
                : 'Spend less time managing your shop. Our tools will allow you to&nbsp;efficiently manage sales around the&nbsp;world.',
          }}
        />
        {map(
          item => (
            <div key={item.id} styleName="item">
              <h4
                styleName="itemTitle"
                dangerouslySetInnerHTML={{ __html: item.title }} // eslint-disable-line
              />
              <p
                styleName="itemText"
                dangerouslySetInnerHTML={{ __html: item.text }} // eslint-disable-line
              />
            </div>
          ),
          lang === 'ru' ? itemsRu : itemsEn,
        )}
      </Col>
      <Col size={12} sm={12} md={6} lg={6} xl={6}>
        <div styleName="imageContainer">
          <img src={forSellersImage} alt="storiqa market" />
        </div>
      </Col>
    </Row>
  </div>
);

export default StartSellingForSellers;
