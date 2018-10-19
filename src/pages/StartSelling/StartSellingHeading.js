// flow@

import React from 'react';
import { withRouter, routerShape } from 'found';
import { Container, Row } from 'layout';

import { StartSellingButton } from './index';

import './StartSellingHeading.scss';

type PropsType = {
  router: routerShape,
  lang: string,
};

const StartSellingHeading = ({ router: { push }, lang }: PropsType) => (
  <Container>
    <Row>
      <div styleName="container">
        <h2
          styleName="title"
          /* eslint-disable */
          dangerouslySetInnerHTML={{
            /* eslint-enable */
            __html:
              lang === 'ru'
                ? 'Прими участие в&nbsp;программе тестирования, чтобы привлечь покупателей из&nbsp;Сингапура!'
                : 'Join our community of&nbsp;sellers, and sell to&nbsp;buyers across the&nbsp;globe. Premium shop tools and rewards in&nbsp;crypto!',
          }}
        />
        <div styleName="titleSpacer" />
        <p
          styleName="subtitle"
          /* eslint-disable */
          dangerouslySetInnerHTML={{
            /* eslint-enable */
            __html:
              lang === 'ru'
                ? 'Первые 50&nbsp;магазинов получат до&nbsp;5&nbsp;000$ на&nbsp;промо их&nbsp;товаров в&nbsp;Юго&#8209;Восточной Азии.'
                : 'Act Now! FIrst 50 registered sellers get&nbsp;up to&nbsp;$5000 in&nbsp;credits to&nbsp;promote their shop online. ',
          }}
        />
        <div styleName="button">
          <StartSellingButton
            onClick={() => push('/manage/wizard')}
            text={lang === 'ru' ? 'Создать магазин' : 'Start Selling'}
          />
        </div>
      </div>
    </Row>
  </Container>
);

export default withRouter(StartSellingHeading);
