export function getVersionChangeLog(content: string, version: string) {
  // Version
  const startPattern = new RegExp(`^#(|#) .*${version.replace(/\./g, '\\.')}`);
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

/**
 * create release to github
 * @param version
 */
export async function createRelease(version) {
  // TODO: Create Release
}
