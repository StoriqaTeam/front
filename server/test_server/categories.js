export default {
  name: [{ text: 'top-level category' }],
  children: [
    {
      rawId: 6,
      parentId: -1,
      level: 1,
      name: [{ lang: 'EN', text: '2nd level category' }],
      children: [
        {
          rawId: 38,
          parentId: 6,
          level: 2,
          name: [{ lang: 'EN', text: '3rd lvl cat' }],
          children: [
            {
              rawId: 18,
              parentId: 38,
              level: 3,
              name: [{ lang: 'EN', text: '4th lvl cat' }],
              getAttributes: [
                {
                  id: 'f88588fa-b5c8-4c20-a91b-737281b8f558',
                  rawId: 46,
                  name: [{ lang: 'EN', text: 'attr' }],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};
