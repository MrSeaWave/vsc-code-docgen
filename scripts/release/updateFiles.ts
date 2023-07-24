import path from 'path';
import { readFile, writeFile } from './file';
import { errorLog } from './log';
import { formatDate } from './utils';

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
  let title = `## [Unreleased] \n\n## ${version} (${formatDate(new Date())})`;
  let newContent = content.replace('## [Unreleased]', title);
  await writeFile(changeLogPath, newContent);
}
