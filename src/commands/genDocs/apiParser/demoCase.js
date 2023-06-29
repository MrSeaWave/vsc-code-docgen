let componentDoc = [
  {
    tags: {},
    description: 'Form Row.',
    displayName: 'Row',
    methods: [],
    props: {
      prop1: {
        defaultValue: null,
        description: 'prop1 description',
        name: 'prop1',
        parent: {
          fileName:
            '/Users/sea/workspace/shopee/tem/vscode-react-javascript-snippets/src/temp/vite-project/src/Row.tsx',
          name: 'IRowProps',
        },
        declarations: [
          {
            fileName:
              '/Users/sea/workspace/shopee/tem/vscode-react-javascript-snippets/src/temp/vite-project/src/Row.tsx',
            name: 'IRowProps',
          },
        ],
        required: false,
        type: {
          name: 'string',
        },
      },
      prop2: {
        defaultValue: null,
        description: 'prop2 description',
        name: 'prop2',
        parent: {
          fileName:
            '/Users/sea/workspace/shopee/tem/vscode-react-javascript-snippets/src/temp/vite-project/src/Row.tsx',
          name: 'IRowProps',
        },
        declarations: [
          {
            fileName:
              '/Users/sea/workspace/shopee/tem/vscode-react-javascript-snippets/src/temp/vite-project/src/Row.tsx',
            name: 'IRowProps',
          },
        ],
        required: true,
        type: {
          name: 'number',
        },
      },
      prop3: {
        defaultValue: null,
        description: 'prop3 description',
        name: 'prop3',
        parent: {
          fileName:
            '/Users/sea/workspace/shopee/tem/vscode-react-javascript-snippets/src/temp/vite-project/src/Row.tsx',
          name: 'IRowProps',
        },
        declarations: [
          {
            fileName:
              '/Users/sea/workspace/shopee/tem/vscode-react-javascript-snippets/src/temp/vite-project/src/Row.tsx',
            name: 'IRowProps',
          },
        ],
        required: true,
        type: {
          name: '() => void',
        },
      },
      prop4: {
        defaultValue: null,
        description: 'prop4 description',
        name: 'prop4',
        parent: {
          fileName:
            '/Users/sea/workspace/shopee/tem/vscode-react-javascript-snippets/src/temp/vite-project/src/Row.tsx',
          name: 'IRowProps',
        },
        declarations: [
          {
            fileName:
              '/Users/sea/workspace/shopee/tem/vscode-react-javascript-snippets/src/temp/vite-project/src/Row.tsx',
            name: 'IRowProps',
          },
        ],
        required: true,
        type: {
          name: 'enum',
          raw: '"option1" | "option2" | "option3"',
          value: [
            {
              value: '"option1"',
            },
            {
              value: '"option2"',
            },
            {
              value: '"option3"',
            },
          ],
        },
      },
    },
  },
];

// ========================== DUMI ==========================

let defaultDefinition = {};

let definitions = {};
componentDoc.forEach((item) => {
  // convert result to IApiDefinition
  const exportName = item.displayName;
  const props = Object.entries(item.props).map(([identifier, prop]) => {
    const result = { identifier };
    const fields = [
      'identifier',
      'description',
      'type',
      'defaultValue',
      'required',
    ];
    const localeDescReg = /(?:^|\n+)@description\s+/;

    fields.forEach((field) => {
      switch (field) {
        case 'type':
          result.type = prop.type.raw || prop.type.name;
          break;

        case 'description':
          // the workaround way for support locale description
          // detect locale description content, such as @description.zh-CN xxx
          if (localeDescReg.test(prop.description)) {
            // split by @description symbol
            const groups = prop.description
              .split(localeDescReg)
              .filter(Boolean);

            groups?.forEach((str) => {
              const [, locale, content] = str.match(/^(\.[\w-]+)?\s*([^]*)$/);

              result[`description${locale || ''}`] = content;
            });
          } else if (prop.description) {
            result.description = prop.description;
          }
          break;

        case 'defaultValue':
          if (prop[field]) {
            result.default = prop[field].value;
          }
          break;

        default:
          if (prop[field]) {
            result[field] = prop[field];
          }
      }
    });

    return result;
  });

  if (exportName === 'default') {
    defaultDefinition = props;
  } else {
    definitions[exportName] = props;
  }
});

// to make sure default export always in the top
if (defaultDefinition) {
  definitions = Object.assign({ default: defaultDefinition }, definitions);
}

console.log('definitions', definitions);
console.log('defaultDefinition', defaultDefinition);
