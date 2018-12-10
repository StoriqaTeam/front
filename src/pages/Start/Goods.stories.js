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
       rawId={1111}
       store={{
        rawId: 2222,
       }}
       name={[
        lang: "english",
        text: "book", 
       ]}
       currency="stq"
       variants={{
           first: {
          rawId: 111,
          discount: 0,
          photoMain: "Harry Potter",
          cashback: 0,
          price: 1000000,
        }
       }}
        rating={5}
    />
));
    

 

 
  

  