import * as ts from 'typescript';
import * as fs from 'node:fs/promises';
import * as requireFromString from 'require-from-string';

export const $import = async (moduleName: string) => {
  // polyfill for environments that don't support dynamic
  // http imports yet like VSCode.
  console.log('require.resolve(moduleName)', require.resolve(moduleName));
  const moduleAsText = await fs.readFile(require.resolve(moduleName), {
    encoding: 'utf-8',
  });
  try {
    const asCjs = transpileToCjs(moduleAsText);
    console.log('asCjs', asCjs);
    const module = requireFromString(asCjs);
    // for whatever reason, the default export is a function
    // that we need to call to get the property
    // if (module.default) {
    // 	module.default = module.default()
    // }
    return module;
  } catch (error) {
    throw new Error(
      `Error while importing ${moduleName}: ${
        (error as Error)?.message ?? 'Unknown error'
      }`,
      { cause: error }
    );
  }
};

function transpileToCjs(code: string): string {
  const compilerOptions: ts.CompilerOptions = {
    module: ts.ModuleKind.CommonJS,
    target: ts.ScriptTarget.ES2020,
  };

  const result = ts.transpileModule(code, { compilerOptions });
  return result.outputText;
}
