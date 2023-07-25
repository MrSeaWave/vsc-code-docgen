import { $ } from 'execa';
import pkgJson from '../../package.json';
import { infoLog } from './log';
const $$ = $({ stdio: 'inherit' });

export async function releasePkg() {
  infoLog(`release ${pkgJson.name}@${pkgJson.version} pkg...\n`);
  const { stdout } = await $$`vsce publish --no-dependencies`;
  // console.log('stdout', stdout);
}
