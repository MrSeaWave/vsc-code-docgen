import { errorHandler } from './errorHanlder';
import { printLogo } from './utils';

/**
 * 发布新的pkg
 */
export function release() {
  console.log('Hello World');
}

export async function main(): Promise<void> {
  try {
    // Setup global error handlers
    process.on('uncaughtException', errorHandler);
    process.on('unhandledRejection', errorHandler);

    await printLogo();

    release();
  } catch (error) {
    errorHandler(error as Error);
  }
}

main();
