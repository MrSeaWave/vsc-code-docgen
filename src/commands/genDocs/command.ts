import * as vscode from 'vscode';
import { reactTsParser } from './apiParser';

export function genDocs(file: vscode.Uri, options?: Options) {
  genReactDocs(file.path);
}

type Options = {};

/**
 * 生成 React ts 类型的 文件
 * @param filePath
 */
export async function genReactDocs(filePath: string) {
  let apis = reactTsParser(filePath);
}
