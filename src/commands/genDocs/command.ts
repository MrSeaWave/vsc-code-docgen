import * as vscode from 'vscode';
import { reactTsParser } from './apiParser';
import { genMD } from './genMD';

export async function genDocsToClipboard(file: vscode.Uri, options?: Options) {
  try {
    let { docs, num } = await genReactDocs(file.path);
    console.log('docs: \n', docs);
    await vscode.env.clipboard.writeText(docs);
    let message = '类型文档已成功复制到剪贴板📋';
    vscode.window.showInformationMessage(message);
  } catch (error) {
    // @ts-expect-error
    vscode.window.showErrorMessage(error.message || '复制失败，请重试');
  }
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
  return { docs: docs.join('\n'), num: apis.length };
}
