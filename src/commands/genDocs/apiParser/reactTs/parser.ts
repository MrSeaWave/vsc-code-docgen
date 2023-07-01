import * as ts from 'typescript';
import * as docgen from 'react-docgen-typescript';
import { ApiDefinition, AtomPropsDefinition } from '../../types/interfaces';

let FIELDS = [
  'identifier',
  'description',
  'type',
  'defaultValue',
  'required',
] as const;
let LOCALE_DESC_REG = /(?:^|\n+)@description\s+/;

/**
 * 由  ComponentDoc 转换成 Api 的数据格式
 * @param componentDoc
 * @returns
 */
function toAtomPropsDefinition(
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

/**
 * 解析 react ts 文件
 * @param filePath 文件路径
 * @returns
 */
export function reactTsParser(filePath: string) {
  // https://github.com/umijs/dumi/pull/354/files
  let docParser = docgen.withCompilerOptions(
    {
      /** To Fix This: const MyComponent: React.FC<Props> = (props) => {...}
       * https://github.com/styleguidist/react-docgen-typescript/issues/393
       *
       */
      esModuleInterop: true,
      // For src/commands/genDocs/tests/examples/raw/multiple.tsx
      jsx: ts.JsxEmit.Preserve,
    },
    {
      savePropValueAsString: true,
      /**
       * 使如下代码的生成的文档里显示的类型是 large | middle | small 而不是 sizeType
       * @example
       * ```ts
       * type sizeType = "large" | "middle" | "small";
       * interface Props {
       *  size?: sizeType;
       * }
       * ```
       */
      shouldExtractLiteralValuesFromEnum: true,
      // 把 undefined 这个类型从文档中去掉
      shouldRemoveUndefinedFromOptional: true,
      // shouldExtractValuesFromUnion: true,
      propFilter: (prop: docgen.PropItem) => {
        if (prop.declarations !== undefined && prop.declarations.length > 0) {
          const hasPropAdditionalDescription = prop.declarations.find(
            (declaration) => {
              return !declaration.fileName.includes('node_modules');
            }
          );

          return Boolean(hasPropAdditionalDescription);
        }

        return true;
      },
    }
  );
  return docParser.parse(filePath).map(toAtomPropsDefinition);
}
