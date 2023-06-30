import * as vscode from 'vscode';
import * as ts from 'typescript';
import * as docgen from 'react-docgen-typescript';

type Options = {};

export async function genReactDocs(file: vscode.Uri, options?: Options) {
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
  let componentDocs = docParser.parse(file.path);
}
