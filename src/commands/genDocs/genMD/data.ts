export const data = [
  {
    exportName: 'Row',
    attrs: [
      { identifier: 'prop1', description: 'prop1 description', type: 'string' },
      {
        identifier: 'prop2',
        description: 'prop2 description',
        type: 'number',
        default: '123',
        required: true,
      },
      {
        identifier: 'prop3',
        description: 'prop3 description',
        type: '() => void',
        required: true,
      },
      {
        identifier: 'prop4',
        description: 'prop4 description',
        type: '"option1" | "option2" | "option3"',
        required: true,
      },
    ],
  },
];
