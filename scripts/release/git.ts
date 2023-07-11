import { $ } from 'execa';
import { execSync } from 'child_process';
import { infoLog, warningLog } from './log';

async function isWorkingTreeClean() {
  try {
    const { stdout: status } = await $`git status --porcelain`;
    if (status.length) {
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
}

function sleep(time) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(''), time * 1000);
  });
}
/**
 * 检查当前工作区是否有未提交文件
 */
export async function checkWorkingTreeIsClean() {
  await sleep(10);
  let status = await isWorkingTreeClean();
  if (!status) {
    throw new Error('Unclean working tree. Commit or stash changes first.');
  }
}

export function tryGitCommit(msg: string) {
  try {
    infoLog('Create a commit.');
    execSync('git add -A', { stdio: 'ignore' });
    execSync(`git commit -m " ${msg} "`, { stdio: 'ignore' });
    return true;
  } catch (e) {
    warningLog('Commit Error.');
    console.warn(e);
  }
}

// export function
