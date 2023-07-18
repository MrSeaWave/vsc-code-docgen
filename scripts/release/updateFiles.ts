// https://github.com/MrSeaWave/lint-config/blob/main/scripts/createRelease.js

import fs from 'fs';
import path from 'path';

// https://github.com/MrSeaWave/semi-design/blob/c0ef56c31a5c13adb050fbdb611e51da881f0cb8/scripts/release.js#L14
export async function updateFiles(): Promise<void> {
  let name = path.basename(relPath).trim().toLowerCase();

  switch (name) {
    case 'package.json':
      return updateManifestFile(relPath, operation);

    default:
      return updateChangeLog(relPath, operation);
  }
}

// Update package.json
async function updateManifestFile(params: type) {}
// Update ChangeLog
export async function updateChangeLog(params: type) {
  const content = fs
    .readFileSync(path.join(__dirname, './CHANGELOG.md'))
    .toString();
  let changeLog = getUnReleasedChangeLog(content);
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
