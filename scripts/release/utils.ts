import figlet from 'figlet';

/**
 * @desc 打印 logo
 * @param text
 */
export async function printLogo(text: string = 'Release') {
  // 回调变异步
  // import { promisify } from 'util';
  // await promisify(figlet)(logo)
  const result = figlet.textSync(text);
  console.log(result);
}

export function sleep(time: number) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(''), time);
  });
}

export function formatDate(date: Date) {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  return [year, month, day].map(formatNumber).join('-');
}

function formatNumber(n: number) {
  let val = n.toString();
  return val[1] ? val : '0' + val;
}
