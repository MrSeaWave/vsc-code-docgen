import { exit } from 'process';
import { ExitCode } from './interfaces';
import { errorLog } from './log';
import { printLogo } from './utils';
import { oraPromise } from 'ora';
import inquirer from 'inquirer';
import {
  SEMVER_INCREMENTS,
  getNewVersionFrom,
  isLowerThanOrEqualTo,
  isValidIncrements,
  isValidVersion,
  prettyVersionDiff,
} from './version';

// package.json 中的信息
export const { version: oldVersion } = require('../../package.json');
/**
 * 发布新的pkg
 */
export async function release() {
  console.log('Hello World');

  // TODO ADD Check work tree clean
  // await oraPromise(checkWorkingTreeIsClean(), 'checking working tree is clean');
  // TODO 确定版本

  const answer = await inquirer.prompt([
    {
      name: 'version',
      type: 'list',
      message: 'Please select a version to update',
      pageSize: SEMVER_INCREMENTS.length + 2,
      choices: [
        ...SEMVER_INCREMENTS.map((type) => ({
          name: `${type}  ${prettyVersionDiff(oldVersion, type)}`,
          value: type,
        })),
        new inquirer.Separator(),
        {
          name: 'use custom version',
          value: null,
        },
      ],
      filter: (input) => {
        return isValidIncrements(input)
          ? getNewVersionFrom(oldVersion, input)
          : input;
      },
    },
    {
      name: 'customVersion',
      type: 'input',
      message: 'Custom Version',
      when: (answers) => !answers.version,
      // filter: (input) => (isValidVersion(input) ? version : input),
      validate(input) {
        if (!isValidVersion(input)) {
          return 'Please specify a valid semver, for example, `1.2.3`. See https://semver.org';
        }

        if (isLowerThanOrEqualTo(input, oldVersion)) {
          return `Version must be greater than ${oldVersion}`;
        }

        return true;
      },
    },
  ]);

  let version = answer.version || answer.customVersion;
  console.log('version', oldVersion, version);
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
