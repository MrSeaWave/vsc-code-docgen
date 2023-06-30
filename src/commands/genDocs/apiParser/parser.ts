import * as docgen from 'react-docgen-typescript';
import { ApiDefinition, AtomPropsDefinition } from './interfaces';

let FIELDS = [
  'identifier',
  'description',
  'type',
  'defaultValue',
  'required',
] as const;
let LOCALE_DESC_REG = /(?:^|\n+)@description\s+/;

// TODO 生成类型定义 （模仿dumi （v1.1.0 版本的api-parser
// ~~然后生成MD格式 （https://github.com/cytle/react-docgen-typescript-markdown-render/tree/master~~
// An html To markdown (https://github.com/mixmark-io/turndown) (不支持table转换)
export function reactTSParser(
  componentDoc: docgen.ComponentDoc
): ApiDefinition {
  const { displayName, props } = componentDoc;

  const attrs = Object.entries(props).map(([identifier, prop]) => {
    const attrs = {} as AtomPropsDefinition;

    FIELDS.forEach((field) => {
      switch (field) {
        case 'identifier':
          attrs.identifier = identifier;
          break;
        case 'type':
          attrs.type = prop.type.raw || prop.type.name;
          break;

        case 'description':
          // the workaround way for support locale description
          // detect locale description content, such as @description.zh-CN xxx
          if (LOCALE_DESC_REG.test(prop.description)) {
            // split by @description symbol
            const groups = prop.description
              .split(LOCALE_DESC_REG)
              .filter(Boolean);

            groups?.forEach((str) => {
              let matches = str.match(/^(\.[\w-]+)?\s*([^]*)$/);
              if (!matches) {
                return;
              }
              let locale = matches[1];
              let content = matches[2];

              attrs[`description${locale || ''}`] = content;
            });
          } else if (prop.description) {
            attrs.description = prop.description;
          }
          break;

        case 'defaultValue':
          if (prop[field]) {
            attrs.default = prop[field].value;
          }
          break;

        default:
          if (prop[field]) {
            attrs[field] = prop[field];
          }
      }
    });

    return attrs;
  });

  return {
    exportName: displayName,
    attrs: attrs,
  };
}
