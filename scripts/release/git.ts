import { execa, $ } from 'execa';

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
  args.push('--message', message);
  // https://github.com/sindresorhus/execa/tree/7bc6eb41018e0a8553add519559055c7e7b6f322#shell-syntax
  // https://github.com/sindresorhus/execa/tree/7bc6eb41018e0a8553add519559055c7e7b6f322#shell
  // await $({ shell: true })`git commit ${args.join(' ')}`;
  await execa('git', ['commit', ...args]);
}

export async function gitTag(tagName: string, message: string) {
  // 必须要加 -a 与 -m ，否则 （git:2.38.0）git push --follow-tags 会不生效
  // https://git-scm.com/docs/git-push/2.38.0
  let args = [
    tagName,
    // Create an annotated tag, which is recommended for releases.
    // See https://git-scm.com/docs/git-tag
    '--annotate',
    // Use the same commit message for the tag
    '--message',
    message,
  ];
  await execa('git', ['tag', ...args]);
}

export async function gitPush() {
  await $`git push --follow-tags`;
}
