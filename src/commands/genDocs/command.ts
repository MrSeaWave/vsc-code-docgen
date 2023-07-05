import * as vscode from 'vscode';
import { reactTsParser } from './apiParser';
import { genMD } from './genMD';

export async function genDocsToClipboard(file: vscode.Uri, options?: Options) {
  try {
    let filePath = getActiveFilePath(file);
    let { docs, num } = await genReactDocs(filePath);
    console.log('docs: \n', docs);
    if (docs) {
      await vscode.env.clipboard.writeText(docs);
    }
    let message = docs ? '类型文档已成功复制到剪贴板📋' : '该文件暂无导出~';
    vscode.window.showInformationMessage(message);
  } catch (error) {
    console.log('报错 \n', error);
    // @ts-expect-error
    vscode.window.showErrorMessage(error.message || '复制失败，请重试');
  }
}

/**
 * 获取当前文件路径
 * @param file
 * @returns
 */
function getActiveFilePath(file: vscode.Uri) {
  if (file) {
    return file.path;
  }
  // 获取当前打开的文件的 editor
  const activeEditor = vscode.window.activeTextEditor;
  if (activeEditor) {
    const activeFilePath = activeEditor.document.uri.path; //fileName;
    return activeFilePath;
  }

  throw new Error('文件路径获取失败');
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
