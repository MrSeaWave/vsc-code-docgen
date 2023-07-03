import * as vscode from 'vscode';
import { reactTsParser } from './apiParser';
import { genMD } from './genMD';

export async function genDocs(file: vscode.Uri, options?: Options) {
  let docs = await genReactDocs(file.path);
  await vscode.env.clipboard.writeText(docs);

  // TODO 增加提示信息
  console.log('docs', docs);
}

type Options = {};

/**
 * 生成 React ts 类型的 文件
 * @param filePath
 */
export async function genReactDocs(filePath: string) {
  let apis = reactTsParser(filePath);

  let calls = apis.map((api) => genMD(api));
  let docs = await Promise.all(calls);
  console.log('---->docs', docs);
  return docs.join('\n');
}
