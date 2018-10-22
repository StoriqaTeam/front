// @flow

import React, { Component, Fragment } from 'react';
import { withRouter } from 'found';
import classNames from 'classnames';
import { map } from 'ramda';

import { Row, Col } from 'layout';

import { StartSellingButton } from './index';

import './StartSellingFAQ.scss';

type StateType = {
  itemId: ?string,
};

type PropsType = {
  lang: string,
};

const faqsEn: Array<{ id: string, text: string, desc: string }> = [
  {
    id: '1',
    text: 'Storiqa marketplace what is it exactly?',
    desc:
      'Storiqa is the&nbsp;first blockchain marketplace for&nbsp;small batch craft goods which gives access to&nbsp;the&nbsp;new markets around the&nbsp;globe, while removing the&nbsp;logistics problem for&nbsp;sellers. All you need to&nbsp;do&nbsp;is to&nbsp;register on&nbsp;the&nbsp;platform, create your own shop and begin selling. We’ll take care of&nbsp;the&nbsp;rest.',
  },
  {
    id: '2',
    text: 'What kind of items would be sold on&nbsp;Storiqa?',
    desc:
      'Our marketplace is focused on&nbsp;items with the&nbsp;following characteriestics: small batch quantity of&nbsp;tailor and craft items, quality goods made with a&nbsp;passion and&nbsp;a&nbsp;story. Handmade? All the&nbsp;better! A&nbsp;good idea of&nbsp;initial types of&nbsp;items we&nbsp;will offer are: bags, backpacks, glasses, wallets and other reasonably sized items. This is just an&nbsp;idea this is by no&nbsp;means a&nbsp;limiting factor, but will give you a&nbsp;better understanding. We do have high standards for&nbsp;our sellers and&nbsp;the&nbsp;goods they offer, each will need to&nbsp;pass our standards prior to&nbsp;being listed to&nbsp;sell on&nbsp;our&nbsp;platform.',
  },
  {
    id: '3',
    text: 'I am from X country can I&nbsp;sell on&nbsp;your&nbsp;platform?',
    desc:
      'We are a&nbsp;global marketplace and will allow sellers from most if not all countries around the&nbsp;globle to&nbsp;sell on&nbsp;Storiqa. However we&nbsp;need to&nbsp;start out from inital tested markets, and currently you are allowed to&nbsp;sell from Singapore and&nbsp;Russia. Sellers from&nbsp;Thailand, Malaysia and Indonesia will&nbsp;be the&nbsp;next order of&nbsp;those who can sell on&nbsp;Storiqa.',
  },
  {
    id: '4',
    text:
      'As a&nbsp;seller in&nbsp;which currency do I&nbsp;get paid out&nbsp;in?',
    desc:
      'Currently you can get paid out in&nbsp;common crypto coins and traditional currency such as&nbsp;USD, RUR or&nbsp;SGD. Others will follow shortly. ',
  },
  {
    id: '5',
    text:
      'What is STQ token exactly? Can I&nbsp;convert&nbsp;it to&nbsp;common currencies?',
    desc:
      'STQ is a&nbsp;payment token, which will&nbsp;be used on&nbsp;the&nbsp;Storiqa marketplace as&nbsp;an&nbsp;instrument for operations, cashback, and&nbsp;rewards.  Purchase and payment of&nbsp;goods for&nbsp;both buyers and sellers. STQ can also be converted into other crypto coins or&nbsp;traditional currencies on&nbsp;various exchanges.',
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
    const { lang } = this.props;
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
                : 'Here are some common questions we recieve about selling on&nbsp;Storiqa:',
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
                text={
                  lang === 'ru' ? 'Создать магазин' : 'Start selling on Storiqa'
                }
                href={
                  lang === 'ru'
                    ? 'https://goo.gl/forms/WK4wj1cQuyNA32wc2'
                    : 'https://goo.gl/forms/MS8FAQ9nD2HOzlku1'
                }
              />
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default withRouter(StartSellingFAQ);
