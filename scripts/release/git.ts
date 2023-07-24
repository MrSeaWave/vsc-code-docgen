import { $ } from 'execa';

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

/**
 * 检查当前工作区是否有未提交文件
 */
export async function checkWorkingTreeIsClean() {
  let status = await isWorkingTreeClean();
  if (!status) {
    throw new Error('Unclean working tree. Commit or stash changes first.');
  }
}

type Commit = {
  message: string;
  noVerify?: boolean;
  all?: boolean;
};

export async function gitCommit(commit: Commit) {
  const { message } = commit;
  let args: string[] = [];
  args.push('--all');
  // args.push("--no-verify");
  args.push(`--message "${message}"`);
  await $`git commit ${args.join(' ')}`;
}

export async function gitTag(tagName: string) {
  await $`git tag ${tagName}`;
}

export async function gitPush() {
  await $`git push --tags`;
}
