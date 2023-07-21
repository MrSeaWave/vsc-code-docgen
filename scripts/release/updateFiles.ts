// https://github.com/MrSeaWave/lint-config/blob/main/scripts/createRelease.js

import fs from 'node:fs/promises';
import path from 'path';
import { readFile, writeFile } from './file';

// https://github.com/MrSeaWave/semi-design/blob/c0ef56c31a5c13adb050fbdb611e51da881f0cb8/scripts/release.js#L14
export async function updateFiles(version: string): Promise<void> {
  // update 'package.json':
  // await updateManifestFile(relPath, operation);

  // update change log
  await updateChangeLog(version);
}

// Update package.json
async function updateManifestFile(params: any) {}
// Update ChangeLog
export async function updateChangeLog(version: string) {
  const changeLogPath = path.join(__dirname, '../../CHANGELOG.md');
  const content = (await readFile(changeLogPath)).toString();
  let newContent = content.replace(
    '## [Unreleased]',
    `## [Unreleased] \n\n## ${version}`
  );
  console.log('Content', content);
  console.log('newContent', newContent);
  await writeFile(changeLogPath, newContent);
  // let changeLog = getUnReleasedChangeLog(content);
  // TODO 写文件
}

function getUnReleasedChangeLog(content: string) {
  // UnReleased
  const startPattern = /^#(|#) \[Unreleased\]/;
  // Prev Version
  const stopPattern = /^#(|#) (|\[)\d+(?:\.\d+){2}/;
  const lines = content.split('\n');
  const changeLog: string[] = [];

  let begin = false;
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    if (begin && stopPattern.test(line)) {
      break;
    }
    if (begin && line) {
      changeLog.push(line);
    }
    if (!begin) {
      begin = startPattern.test(line);
    }
  }

  return changeLog.join('\n');
}
