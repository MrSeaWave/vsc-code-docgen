// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Commands } from './constants/commands';
import { genDocsToClipboard } from './commands';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  console.log('[Code DocGen] 加载成功');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand('docgen.helloWorld', () => {
    // The code you place here will be executed every time your command is executed
    // Display a message box to the user
    vscode.window.showInformationMessage('Hello World from Code Docgen!');
  });

  let genDocToClipboard = vscode.commands.registerCommand(Commands.GenDocToClipboard, (uri) => {
    genDocsToClipboard(uri);
    // vscode.window.showInformationMessage(
    //   `当前文件(夹)路径是：${uri ? uri.path : '空'}`
    // );
  });
  context.subscriptions.push(disposable, genDocToClipboard);
}

// This method is called when your extension is deactivated
export function deactivate() {}
