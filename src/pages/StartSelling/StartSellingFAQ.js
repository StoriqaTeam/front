// @flow

import React, { Component, Fragment } from 'react';
import { withRouter, routerShape } from 'found';
import classNames from 'classnames';
import { map } from 'ramda';

import { Row, Col } from 'layout';

import { StartSellingButton } from './index';

import './StartSellingFAQ.scss';

type StateType = {
  itemId: ?string,
};

type PropsType = {
  router: routerShape,
  lang: string,
};

const faqsEn: Array<{ id: string, text: string, desc: string }> = [
  {
    id: '1',
    text:
      'What is Storiqa marketplace exactly? Where can I get the&nbsp;details?',
    desc:
      'Storiqa&nbsp;— first blockchain marketplace for small batch manufacturers, which will grant them access to&nbsp;the new auditory around the&nbsp;world without any logistics problem for&nbsp;sellers. All you need to&nbsp;do is register on&nbsp;the&nbsp;platform, create your own shop and start selling. We will cover all the other stuff. You can get more details on&nbsp;<a href="storiqa.zendesk.com" target="_blank">storiqa.zendesk.com</a>.',
  },
  {
    id: '2',
    text: 'What kind of items would be sold on&nbsp;Storiqa?',
    desc:
      'Our marketplace is focused on items with the next parameters: small batch, quality, possibly handmade. At the very beginning we will sell such things as&nbsp;bags, backpacks, glasses, wallets and other accessories. We would also have some art pieces and items for&nbsp;home.<br />We have very high conditions for upcoming manufacturers, each of&nbsp;them will&nbsp;be manually checked before entering the&nbsp;platform.',
  },
  {
    id: '3',
    text: 'In which countries I can sell my&nbsp;goods?',
    desc:
      'Our marketplace will be available for all users around the globe in&nbsp;time. For the first step we will start to work with the&nbsp;Indochina countries, such as&nbsp;Singapore, Malaysia, Indonesia&nbsp;etc.',
  },
  {
    id: '4',
    text: 'In which currency can I get the&nbsp;revenue?',
    desc:
      'During the first platform release you can get the revenue in common crypto coins and traditional currency such as&nbsp;USD, RUR or&nbsp;SGD. Other would&nbsp;be implemented soon.',
  },
  {
    id: '5',
    text:
      'What is STQ token exactly? How can I convert it to&nbsp;the&nbsp;common currencies?',
    desc:
      'STQ&nbsp;— crypto token, which will be used on&nbsp;the&nbsp;Storiqa marketplace as&nbsp;an&nbsp;instrument for the&nbsp;operations, cashback and reward for finishing several activities. Besides that STQ can&nbsp;be traded for other crypto coins or&nbsp;traditional currencies on&nbsp;exchanges.&nbsp;*<br />(*&nbsp;trade pairs are different for different exchanges)',
  },
];

const faqsRu: Array<{ id: string, text: string, desc: string }> = [
  {
    id: '1',
    text: 'Что такое маркетплейс Storiqa и&nbsp;где мне узнать подробности?',
    desc:
      'Storiqa&nbsp;— первый маркетплейс на&nbsp;технологии блокчейн для мелкосерийных производителей, который даст доступ к&nbsp;новым целевым аудиториям без трудностей связанных с&nbsp;отправкой. Все что вам нужно&nbsp;— просто зарегистрироваться на&nbsp;платформе, создать магазин и&nbsp;начать продавать! Остальное мы&nbsp;берем на&nbsp;себя. Подробности можно узнать на&nbsp;<a href="storiqa.zendesk.com" target="_blank">storiqa.zendesk.com</a>.',
  },
  {
    id: '2',
    text: 'Какие типы товаров будут продаваться на&nbsp;Storiqa?',
    desc:
      'Наш маркетплейс нацелен на&nbsp;товары немассового производства, т.&nbsp;е. это товары ручной работы или мелкосерийное производство. Следующий важный момент&nbsp;— качество. Мы&nbsp;тщательно отбираем производителей, которые получат доступ к&nbsp;Storiqa и&nbsp;проверяем товары перед тем как разместить&nbsp;их на&nbsp;нашей платформе.<br />В&nbsp;самом начале мы&nbsp;нацелены на&nbsp;следующие категории: предметы личного обихода, такие как сумки, рюкзаки, очки, кошельки и&nbsp;т.&nbsp;д., различного рода аксессуары. Также в&nbsp;отдельную категорию можно выделить предметы для дома и&nbsp;предметы искусства.',
  },
  {
    id: '3',
    text: 'В каких странах я&nbsp;смогу реализовать свои товары?',
    desc:
      'Наш маркетплейс постепенно будет доступен для пользователей со&nbsp;всего мира, на&nbsp;первом этапе мы&nbsp;начнем привлекать покупателей в&nbsp;странах тихоокеанской Азии, таких как Сингапур, Малайзия, Индонезия и&nbsp;т.&nbsp;д.',
  },
  {
    id: '4',
    text: 'В каких валютах я&nbsp;смогу получать выручку?',
    desc:
      'На момент первого релиза платформы вы&nbsp;сможете получить на&nbsp;свой счет как криптовалюту, так и&nbsp;традиционную валюту, такую как USD, RUR или&nbsp;SGD. Прочие валюты будут включены позже.',
  },
  {
    id: '5',
    text:
      'Что такое STQ токен и&nbsp;как я&nbsp;могу конвертировать его в&nbsp;обычные валюты?',
    desc:
      'Токен STQ&nbsp;— это криптовалютный токен, который будет использоваться на&nbsp;маркетплейсе Storiqa как инструмент для оплаты за&nbsp;операции на&nbsp;платформе, как инструмент кешбека или как способ вознаграждения за&nbsp;выполнение определенных действий. Кроме&nbsp;того, STQ токен можно обменять на&nbsp;криптовалютных биржах на&nbsp;другие криптовалюты или на&nbsp;традиционные валюты.',
  },
];

class StartSellingFAQ extends Component<PropsType, StateType> {
  state = {
    itemId: null,
  };

  handlerOnClick = (e: any) => {
    const parent = e.target.parentElement;
    this.setState((prevState: StateType) => {
      const prevItemId = prevState.itemId;
      if (parent && parent.id) {
        return { itemId: prevItemId === parent.id ? null : parent.id };
      }
      return { itemId: prevState.itemId };
    });
  };

  render() {
    const { router, lang } = this.props;
    const { itemId } = this.state;
    return (
      <div styleName="container">
        <h2
          styleName="title"
          /* eslint-disable */
          dangerouslySetInnerHTML={{
            /* eslint-enable */
            __html:
              lang === 'ru'
                ? 'Часто задаваемые вопросы'
                : 'Frequently asked questions',
          }}
        />
        <p
          styleName="subtitle"
          /* eslint-disable */
          dangerouslySetInnerHTML={{
            /* eslint-enable */
            __html:
              lang === 'ru'
                ? 'Возможно, у&nbsp;вас возникли вопросы.<br />Вот ответы на&nbsp;самые популярные:'
                : 'Here are some common questions about selling on Storiqa:',
          }}
        />
        <div
          styleName="faqs"
          onClick={this.handlerOnClick}
          onKeyDown={() => {}}
          role="button"
          tabIndex="0"
        >
          {map(item => {
            const show = itemId === item.id;
            return (
              <Fragment key={item.id}>
                <div id={item.id} styleName="faq">
                  <div styleName="plusMinus">{show ? '−' : '+'}</div>
                  <div
                    styleName="text"
                    dangerouslySetInnerHTML={{ __html: item.text }} // eslint-disable-line
                  />
                </div>
                <div
                  styleName={classNames('desc', { show })}
                  dangerouslySetInnerHTML={{ __html: item.desc }} // eslint-disable-line
                />
              </Fragment>
            );
          }, lang === 'ru' ? faqsRu : faqsEn)}
        </div>
        <Row>
          <Col size={12} sm={12} md={12} lg={7} xl={7}>
            <h3
              styleName="ready"
              /* eslint-disable */
              dangerouslySetInnerHTML={{
                /* eslint-enable */
                __html:
                  lang === 'ru'
                    ? 'Готовы начать?'
                    : 'Ready to open your store?',
              }}
            />
          </Col>
          <Col size={12} sm={12} md={12} lg={5} xl={5}>
            <div styleName="button">
              <StartSellingButton
                text={lang === 'ru' ? 'Создать магазин' : 'Start selling'}
                onClick={() => router.push('/manage/wizard')}
              />
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default withRouter(StartSellingFAQ);
