// https://github.com/MrSeaWave/lint-config/blob/main/scripts/createRelease.js
import path from 'path';
import { readFile, writeFile } from './file';
import { errorLog } from './log';

// https://github.com/MrSeaWave/semi-design/blob/c0ef56c31a5c13adb050fbdb611e51da881f0cb8/scripts/release.js#L14
export async function updateFiles(version: string): Promise<void> {
  try {
    // update 'package.json':
    await updateManifestFile(version);

    // update change log
    await updateChangeLog(version);
  } catch (e) {
    errorLog('Update Files failed');
    throw e;
  }
}

// Update package.json
async function updateManifestFile(version: string) {
  const pkgJsonPath = path.join(__dirname, '../../package.json');
  const content = await readFile(pkgJsonPath);
  const data = JSON.parse(content);
  data.version = version;
  let newContent = JSON.stringify(data, null, 2);
  await writeFile(pkgJsonPath, newContent + '\n');
}
// Update ChangeLog
export async function updateChangeLog(version: string) {
  const changeLogPath = path.join(__dirname, '../../CHANGELOG.md');
  const content = await readFile(changeLogPath);
  let newContent = content.replace('## [Unreleased]', `## [Unreleased] \n\n## ${version}`);
  await writeFile(changeLogPath, newContent);
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
