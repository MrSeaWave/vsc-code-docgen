import { errorLog } from './log';

/**
 * CLI exit codes.
 *
 * @see https://nodejs.org/api/process.html#process_exit_codes
 */
export enum ExitCode {
  Success = 0,
  FatalError = 1,
  InvalidArgument = 9,
}

export function errorHandler(error: Error): void {
  let message = error.message || String(error);
  errorLog(message);
  console.log(error.stack);
  process.exit(ExitCode.FatalError);
}
