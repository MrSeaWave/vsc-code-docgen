import semver from 'semver';
import chalk from 'chalk';

export const SEMVER_INCREMENTS: semver.ReleaseType[] = [
  'patch',
  'minor',
  'major',
  'prepatch',
  'preminor',
  'premajor',
  'prerelease',
];

export function isValidIncrements(input: semver.ReleaseType) {
  return SEMVER_INCREMENTS.includes(input);
}

export function isValidVersion(input: string) {
  return Boolean(semver.valid(input));
}

export function isValidVersionWithError(version: string) {
  if (!isValidVersion(version)) {
    throw new Error(
      'Version should be a valid semver version. See https://semver.org'
    );
  }
}

export function isValidIncrementsWithError(type: semver.ReleaseType) {
  if (!isValidIncrements(type)) {
    throw new Error(
      `Version should be either ${SEMVER_INCREMENTS.join(', ')}.`
    );
  }
}
export function getNewVersionFrom(
  version: string,
  releaseType: semver.ReleaseType
) {
  isValidVersionWithError(version);
  isValidIncrementsWithError(releaseType);
  let newVersion = semver.inc(version, releaseType);
  if (!newVersion) {
    throw new Error(
      `New Version ${newVersion} should be a valid semver version.`
    );
  }
  return newVersion;
}

/**
 * v1<=v2
 * @param v1
 * @param v2
 * @returns
 */
export function isGreaterThanOrEqualTo(v1: string, v2: string) {
  isValidVersionWithError(v1);
  isValidVersionWithError(v2);

  return semver.lte(v1, v2);
}

export function prettyVersionDiff(
  oldVersion: string,
  releaseType: semver.ReleaseType
) {
  // 1.2.4-beta.0

  const newVersionList = getNewVersionFrom(oldVersion, releaseType).split('.');
  let oldVersionList = oldVersion.split('.');

  let firstVersionChange = false;
  const output = [];
  newVersionList.forEach((str, i) => {
    output.push(str);
  });

  let version = output.join('.');

  return chalk.dim.cyan(version);

  // for (const [i, element] of newVersionList.entries()) {
  //   if (element !== oldVersion[i] && !firstVersionChange) {
  //     output.push(`${chalk.dim.cyan(element)}`);
  //     firstVersionChange = true;
  //   } else if (element.indexOf('-') >= 1) {
  //     let preVersion = [];
  //     preVersion = element.split('-');
  //     output.push(`${chalk.dim.cyan(`${preVersion[0]}-${preVersion[1]}`)}`);
  //   } else {
  //     output.push(chalk.reset.dim(element));
  //   }
  // }

  return output.join(chalk.reset.dim('.'));
}
