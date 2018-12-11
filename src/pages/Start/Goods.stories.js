import React from 'react';
import { storiesOf } from '@storybook/react';

import Goods from 'pages/Start/Goods';
import { text, withKnobs } from '@storybook/addon-knobs';

const label = 'Your name';
const defaultValue = 'Harry Potter';
const groupId = 'GROUP-ID1';
const value = text(label, defaultValue, groupId); 

storiesOf('Goods', module)
.addDecorator(withKnobs)
.add('Default', () => (
    <Goods
        items={[{
          rawId: 111,
          storeId: 222,
          currency: "stq",
          name: [{
            lang: "EN",
            text: "Harry Potter",
          }],
          products: {
            edges: [{
               node: {cashback: 20, discount: 0, id: "good", photoMain: "book", price: 30, rawId: 444},
            }]
          },
          rating: 5,
          priceUsd: 30 
        }]}
        title="Harry Potter"
        seeAllUrl="url"
    />
));
    

 

 
  

  