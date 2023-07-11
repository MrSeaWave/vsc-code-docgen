import { execSync } from 'child_process';
import { infoLog, warningLog } from './log';

/**
 * 检查当前工作区是否有未提交文件
 */
export function checkGitStatus() {
  const gitStatus = execa.sync('git', ['status', '--porcelain']).stdout;
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
