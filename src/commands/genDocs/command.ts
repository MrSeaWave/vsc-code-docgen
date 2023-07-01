import * as vscode from 'vscode';
import { reactTsParser } from './apiParser';
import { genMD } from './genMD';

export async function genDocs(file: vscode.Uri, options?: Options) {
  let docs = genReactDocs(file.path);
  console.log('docs', docs);
}

type Options = {};

/**
 * 生成 React ts 类型的 文件
 * @param filePath
 */
export function genReactDocs(filePath: string) {
  let apis = reactTsParser(filePath);

  let docs = apis.map((api) => genMD(api));
  console.log('---->docs', docs);
  return docs.join('\n');
}
