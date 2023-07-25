import chalk from 'chalk';

function log(fn: Function) {
  return (msg: any) => {
    console.log(fn(msg));
  };
}

export const successLog = log(chalk.green);
export const errorLog = log(chalk.red);
export const warningLog = log(chalk.yellow);
export const infoLog = log(chalk.cyan);
