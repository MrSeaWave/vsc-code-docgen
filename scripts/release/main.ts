import { exit } from 'process';
import { ExitCode } from './interfaces';
import { errorLog, infoLog } from './log';
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
import { updateFiles } from './updateFiles';
import { createRelease } from './createRelease';
import { releasePkg } from './releasePkg';
import { checkWorkingTreeIsClean, gitCommit, gitPush, gitTag } from './git';
import { version as oldVersion } from '../../package.json';

/**
 * Release
 */
export async function release() {
  await oraPromise(checkWorkingTreeIsClean(), 'checking working tree is clean');

  const version = await askVersion();

  console.log('version', oldVersion, version);

  await oraPromise(updateFiles(version), 'updating manifest file & changelog');

  // Git Commit,Tag,Push
  await gitWorkflow(version);
  // Release VSC Pkg
  await releasePkg();
  // finally
  // createRelease(version);
}

/**
 * ask version
 * @returns version
 */
async function askVersion() {
  infoLog(`The current version is ${oldVersion}`);
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
        return isValidIncrements(input) ? getNewVersionFrom(oldVersion, input) : input;
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

  return answer.version || answer.customVersion;
}

/**
 * Git Commit,tag,push
 * @param version
 */
export async function gitWorkflow(version: string) {
  let msg = `chore(release): publish v${version} 🎨 🎨 🎨`;
  let tagName = `v${version}`;

  await oraPromise(gitCommit({ message: msg }), 'Git Commit');
  await oraPromise(gitTag(tagName), 'Git Tag');
  await oraPromise(gitPush(), 'Git Push');
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
  console.log('\n\n\n');
  errorLog(message);
  console.log(error.stack);
  // // 主动退出程序,跳过接下来的代码
  // exit(ExitCode.FatalError);
}

main();
