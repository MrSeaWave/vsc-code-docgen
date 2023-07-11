import { exit } from 'process';
import { ExitCode } from './interfaces';
import { errorLog } from './log';
import { printLogo, waitFnLoading } from './utils';
import { checkWorkingTreeIsClean } from './git';
import { oraPromise } from 'ora';

/**
 * 发布新的pkg
 */
export async function release() {
  console.log('Hello World');

  await oraPromise(checkWorkingTreeIsClean(), 'checking working tree is clean');
  // TODO 确定版本
}

export async function main(): Promise<void> {
  try {
    // 全局错误监听
    process.on('uncaughtException', errorHandler);
    process.on('unhandledRejection', errorHandler);

    await printLogo();

    await release();
  } catch (error) {
    errorHandler(error as Error);
  }
}

function errorHandler(error: Error): void {
  let message = error.message || String(error);
  errorLog(message);
  console.log(error.stack);
  // // 主动退出程序,跳过接下来的代码
  // exit(ExitCode.FatalError);
}

main();
