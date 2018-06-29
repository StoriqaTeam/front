const mock = {
  number: '1488',
  product: {
    id: '4r4r44',
    name: 'Nike shoes with red strings and some features',
    photoUrl: 'https://s3.amazonaws.com/storiqa-dev/img-Ey3dmxt4YtAC-small.png',
    category: {
      id: 'a4g4gg',
      name: 'Clothes and acccessories',
    },
    price: 24500,
    attributes: [
      {
        name: 'Color',
        value: 'red',
      },
      {
        name: 'Material',
        value: 'Leather',
      },
      {
        name: 'Size',
        value: '200x200cm',
      },
    ],
  },
  customer: {
    name: 'Konstantin Konstantinov',
    address: 'Moscow, Prospekt Mira 34, ap. 4',
  },
  date: 1529497331,
  delivery: 'Pony express',
  trackId: 'RN908345345',
  quantity: 4,
  subtotal: 450000,
  status: 'delivered',
  paymentStatus: 'paid',
  statusHistory: [
    {
      date: 1529497331,
      manager: 'Jefferson D.',
      status: 'Delivered',
    },
    {
      date: 1529497331,
      manager: 'Brown R.',
      status: 'On deliver',
    },
    {
      date: 1529497331,
      manager: 'Jefferson D.',
      status: 'On deliver',
      additionalInfo: 'Attached tracking number 35345345-dfsd-23',
    },
  ],
};

export default mock;
