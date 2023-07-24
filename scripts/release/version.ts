import semver from 'semver';
import chalk from 'chalk';

// The VS Marketplace doesn't support prerelease versions: '0.1.4-0'
// https://code.visualstudio.com/api/working-with-extensions/publishing-extension#prerelease-extensions
export const SEMVER_INCREMENTS: semver.ReleaseType[] = [
  'patch',
  'minor',
  'major',
  // 'prepatch',
  // 'preminor',
  // 'premajor',
  // 'prerelease',
];

export function isValidIncrements(input: semver.ReleaseType) {
  return SEMVER_INCREMENTS.includes(input);
}

export function isValidVersion(input: string) {
  return Boolean(semver.valid(input));
}

export function isValidVersionWithError(version: string) {
  if (!isValidVersion(version)) {
    throw new Error('Version should be a valid semver version. See https://semver.org');
  }
}

export function isValidIncrementsWithError(type: semver.ReleaseType) {
  if (!isValidIncrements(type)) {
    throw new Error(`Version should be either ${SEMVER_INCREMENTS.join(', ')}.`);
  }
}
export function getNewVersionFrom(version: string, releaseType: semver.ReleaseType) {
  isValidVersionWithError(version);
  isValidIncrementsWithError(releaseType);
  let newVersion = semver.inc(version, releaseType);
  if (!newVersion) {
    throw new Error(`New Version ${newVersion} should be a valid semver version.`);
  }
  return newVersion;
}

/**
 * v1<=v2
 * @param v1
 * @param v2
 * @returns
 */
export function isLowerThanOrEqualTo(v1: string, v2: string) {
  isValidVersionWithError(v1);
  isValidVersionWithError(v2);

  return semver.lte(v1, v2);
}

/**
 * v1>=v2
 * @param v1
 * @param v2
 * @returns
 */
export function isGreaterThanOrEqualTo(v1: string, v2: string) {
  isValidVersionWithError(v1);
  isValidVersionWithError(v2);

  return semver.gte(v1, v2);
}

export function prettyVersionDiff(oldVersion: string, releaseType: semver.ReleaseType) {
  // 1.2.4-beta.0

  const version = getNewVersionFrom(oldVersion, releaseType);

  return chalk.dim.cyan(version);
}
