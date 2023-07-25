import fs from 'node:fs/promises';

export async function readFile(filePath: string) {
  return fs.readFile(filePath, { encoding: 'utf8' });
}

export async function writeFile(filePath: string, data: any) {
  return fs.writeFile(filePath, data, { encoding: 'utf8' });
}
