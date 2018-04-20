// @flow

import React, { PureComponent } from 'react';
import { createFragmentContainer, graphql } from 'react-relay';

import { Header, Footer, Main } from 'components/App';
import { Container, Col, Row } from 'layout';

import { extractText, buildWidgets, filterVariants, isEmpty } from 'utils';

import {
  ProductImage,
  ProductShare,
  ProductDetails,
  Tab,
  Tabs,
  TabRow,
} from './index';

import './Product.scss';
import mockData from './mockData.json';

type PropsType = {
  baseProduct: {}
};

type StateType = {
  tabs: {id: string | number, label: string, content: any}[],
  widgets: {},
}

class Product extends PureComponent<PropsType, StateType> {
  state = {
    tabs: [
      {
        id: 0,
        label: 'Описание',
        content: (<TabRow row={mockData.row} />),
      },
    ],
    widgets: {},
  };
  componentWillReceiveProps(nextProps: PropsType) {
    const {
      baseProduct: {
        variants: {
          all,
        },
      },
    } = nextProps;
    const { widgets } = this.state;
    if (isEmpty(widgets)) {
      this.setState({
        widgets: buildWidgets(all),
      });
    }
  }
  handleWidgetClick = (selected): void => {
    const {
      baseProduct: {
        variants: {
          all,
        },
      },
    } = this.props;
    /* eslint-disable no-console */
    console.log('selected', selected);
    console.log('filterVariants(all, selected)', filterVariants(all, selected));
    filterVariants(all, selected);
  };
  render() {
    const {
      baseProduct: {
        name,
        longDescription,
      },
    } = this.props;
    const { tabs, widgets } = this.state;
    return (
      <div styleName="container">
        <Header />
        <Main>
          <div styleName="ProductBackground">
            <Container>
              <div styleName="whiteBackground">
                <Row>
                  <Col size={6}>
                    <ProductImage />
                    <ProductShare />
                  </Col>
                  <Col size={6}>
                    {!isEmpty(widgets) ? (
                      <ProductDetails
                        productTitle={extractText(name)}
                        productDescription={extractText(longDescription, 'EN', 'No Description')}
                        widgets={widgets}
                        onWidgetClick={this.handleWidgetClick}
                      />
                    ) : null}
                  </Col>
                </Row>
              </div>
            </Container>
          </div>
          <Container>
            <Tabs>
              {tabs.map(({ id, label, content }) => (
                <Tab
                  key={id}
                  label={label}
                >
                  { content }
                </Tab>
              ))}
            </Tabs>
          </Container>
        </Main>
        <Footer />
      </div>
    );
  }
}

export default createFragmentContainer(
  Product,
  graphql`
    fragment Product_baseProduct on BaseProduct {
      id
      name {
        text
        lang
      }
      shortDescription {
        text
        lang
      }
      longDescription {
        text
        lang
      }
      variants {
        all {
          id
          attributes {
            value
            metaField
            attribute {
              id
              name {
                text
                lang
              }
              metaField {
                values
                uiElement
                translatedValues {
                  translations {
                    lang
                    text
                  }
                }
              }
            }
          }
        }
      }
    }   
  `,
);
