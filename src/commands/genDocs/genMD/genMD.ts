// import { toMarkdown } from 'mdast-util-to-markdown';
import { ApiDefinition } from '../types';
import { Column, heading, inlineCode, root, table, text } from './toMDAst';
// const { toMarkdown } = madastUtils;

// TODO 未来可由用户控制排序
let columns: Column[] = [
  { title: '属性名', dataIndex: 'identifier' },
  { title: '描述', dataIndex: 'description' },
  { title: '类型', dataIndex: 'type', render: (value) => inlineCode(value) },
  {
    title: '默认值',
    dataIndex: 'default',
    render: (value) => (value !== undefined ? inlineCode(value) : text('-')),
  },
  {
    title: '必填',
    dataIndex: 'required',
    render: (value) => (!!value ? text('✓') : text('✗')),
  },
];
/**
 * 根据api定义方式，生成MD文档
 *~~然后生成MD格式 （https://github.com/cytle/react-docgen-typescript-markdown-render/tree/master~~
 * // An html To markdown (https://github.com/mixmark-io/turndown) (不支持table转换)
 * @param api
 * | 属性名 | 描述     | 类型     | 默认值   | 必填 |
 * | ------ | -------- | -------- | -------- | ---- |
 * | title  | 属性描述 | `string` | `默认值` | ✗    |
 * |        |          |          |          | ✓    |
 *
 *
 *
 */
export async function genMD(api: ApiDefinition) {
  let { exportName, attrs = [] } = api;
  console.log('api', api);
  console.log('load import package');
  const { toMarkdown } = await import('mdast-util-to-markdown');
  const { gfmToMarkdown } = await import('mdast-util-gfm');
  let node = root([heading([text(exportName)], 3), table(columns, attrs)]);

  const str = toMarkdown(node, { extensions: [gfmToMarkdown()] });
  return str;
}
