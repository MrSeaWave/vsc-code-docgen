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
