// @flow

import React from 'react';

import { HeaderResponsive, FooterResponsive, AppContext } from 'components/App';
import { Button } from 'components/common/Button';
import { Container, Col, Row } from 'layout';

import './StartSelling.scss';

const StartSelling = () => (
  <AppContext.Consumer>
    {({ environment }) => (
      <div styleName="main">
        {/* <HeaderResponsive environment={environment} withoutCategories /> */}
        {/* <div styleName="bgMain" /> */}
        <div styleName="block-1">
          <div styleName="left">
            <div styleName="halfBlock">
              <div styleName="title">Millions of shoppers are waiting</div>
              <div styleName="titleSeparator" />
              <div styleName="subtitle">
                Start selling now with Storiqa and see how it’s easy to trade
                globally
              </div>
              <div styleName="button">Start selling</div>
            </div>
          </div>
          <div styleName="right">
            <img
              // eslint-disable-next-line
              src={require('./img/main.png')}
              alt="main"
            />
          </div>
        </div>
        <div styleName="block-2">
          <div styleName="left">
            <div styleName="halfBlock">
              <h2>STORIQA IS YOUR DOOR TO<br /> GLOBAL MARKET</h2>
              <div styleName="subtitle">Our goal is to guarantee the quality of experience and goods, for both buyers and sellers.</div>
              <p>Storiqa is an online marketplace offering global access with minimal financial borders and global transactional fees. We’re committed to helping our sellers thrive. Our goal is to guarantee the quality of experience and goods, for both buyers and sellers.</p>
              <p>Key platform features such as inclusive advertising and promotion, sales analysis, book-keeping and direct customer feedback make Storiqa ideal for entrepreneurs, small-scale manufacturers, family businesses and makers of handmade crafts.</p>
            </div>
          </div>
          <div styleName="right">
            <img
              // eslint-disable-next-line
              src={require('./img/site.png')}
              alt="main"
            />
          </div>
        </div>
        <div styleName="block-3">
          <div styleName="left">
            <div styleName="halfBlock">
              <h2>WHY SHOULD YOU<br /> TRY STORIQA</h2>
              <div styleName="subtitle">Our goal is to guarantee the quality of experience and goods, for both buyers and sellers.</div>
            </div>
          </div>
          <div styleName="right" />
          <div styleName="container">
            <div styleName="flexWrapper">
              <div styleName="infoBlock">
                <div styleName="title">Low fee</div>
                <div styleName="content">It doesn’t take much to list your items and once you make a sale, Storiqa’s transaction fee is just 5%.</div>
              </div>
              <div styleName="infoBlock">
                <div styleName="title">24/7 customer support</div>
                <div styleName="content">One of the most important aspects of running an online store is clear and quick communication with customers. We provide 24/7 customer service and and online consultants in regional languages.</div>
              </div>
              <div styleName="infoBlock">
                <div styleName="title">Integrated marketing tools</div>
                <div styleName="content">We provide the marketing needed to boost sales, from newsletters and CPA networks to paid advertising and many more.</div>
              </div>
              <div styleName="infoBlock">
                <div styleName="title">Payments in cryptocurrency</div>
                <div styleName="content">Sellers receive payment in the currency of their choosing, including cryptocurrencies like STQ, Bitcoin, Ethereum and others. These eliminate multiple bank transaction charges and long waits to receive payments.</div>
              </div>
              <div styleName="infoBlock">
                <div styleName="title">Powerful tools</div>
                <div styleName="content">We offer an efficient, simple, and powerful set of sales tools with a clear interface and thorough follow-up, all to make your goods available globally.</div>
              </div>
              <div styleName="infoBlock">
                <div styleName="title">Storiqa fulfillment center</div>
                <div styleName="content">Bring your product to our center, the rest we will take care yourselves: creating a product cards, preparing promotional and marketing materials, processing orders, supporting sales.</div>
              </div>
            </div>
          </div>
        </div>
        <div styleName="block-4">
          <div styleName="left">
            <div styleName="halfBlock">
              <h2>Storiqa is a real swiss<br />army knife for SELLERS</h2>
              <div styleName="subtitle">Spend less time managing your shop. Our tools will allow you to efficiently manage sales around the world</div>
              <div styleName="flexWrapper">
                <div styleName="infoBlock">
                  <div styleName="title">CRM Analytics</div>
                  <div styleName="content">Manage your store, sales, employees, warehouses in a convenient interface anywhere in the world. Get statistics and analytics online</div>
                </div>
                <div styleName="infoBlock">
                  <div styleName="title">CPA networks</div>
                  <div styleName="content">Use our CPA network in order to advertise your products and increase sales</div>
                </div>
                <div styleName="infoBlock">
                  <div styleName="title">Mobile Wallet</div>
                  <div styleName="content">Track all cash inflows in a convenient mobile application, convert and withdraw funds</div>
                </div>
              </div>
            </div>
          </div>
          <div styleName="right">
            <div styleName="halfBlock">
              <img
                // eslint-disable-next-line
                src={require('./img/phone.png')}
                alt="phone"
              />
            </div>
          </div>
        </div>
        <div styleName="block-5">
          <div styleName="left">
            <div styleName="halfBlock">
              <h2>Low fee & high<br />transparency</h2>
            </div>
          </div>
          <div styleName="right" />
          <div styleName="container">
            <div styleName="flexWrapper">
              <div styleName="variant">
                <div styleName="content">
                  <div styleName="variantTitle">Standard</div>
                </div>
              </div>
              <div styleName="variant">
                <div styleName="content">
                  <div styleName="variantTitle">Standard</div>
                </div>
              </div>
              <div styleName="variant">
                <div styleName="content">
                  <div styleName="variantTitle">Standard</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <FooterResponsive />
      </div>
    )}
  </AppContext.Consumer>
);

export default StartSelling;
