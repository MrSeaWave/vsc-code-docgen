/**
 * 转换成 [mdast](https://github.com/syntax-tree/mdast)
 * // TODO 未来可以考虑把这部分封成npm包 （mdast-utils (包含转换ast，以及 toMarkdown 功能)
 */
// import { unified } from 'unified';
// import remarkStringify from 'remark-stringify';
import {
  AlignType,
  Heading,
  InlineCode,
  PhrasingContent,
  Root,
  RowContent,
  Table,
  TableCell,
  TableRow,
  Text,
} from 'mdast';
import { ArrayType } from './interfaces';

// function getProcessor() {
//   return unified().use(remarkStringify, {
//     bullet: '*',
//     fence: '~',
//     fences: true,
//     incrementListMarker: false,
//   });
// }

// function nodeWithChildren(type:string,children?:)

function nodeWithValue(type: string, value: string) {
  return { type, value };
}

export function root(children: Root['children']): Root {
  return { type: 'root', children };
}

export function heading(
  children: Heading['children'],
  depth: Heading['depth']
): Heading {
  return {
    type: 'heading',
    depth: depth || 4,
    children: children,
  };
}

export function text(value: string): Text {
  return { type: 'text', value };
}

export function inlineCode(value: string): InlineCode {
  return { type: 'inlineCode', value };
}

// ========================== Table ==========================
export type Column = {
  // 列头显示文字
  title: string | TableCellNode;
  // 列数据在数据项中对应的路径，支持通过数组查询嵌套路径
  dataIndex: string;
  // 设置列的对齐方式
  align?: AlignType;
  // 生成复杂数据的渲染函数，参数分别为当前行的值，当前行数据，行索引
  render?: (value: any) => TableCellNode;
};

/**
 * 每一行表的node定义
 * @param children
 * @returns
 */
export function tableRow(children?: RowContent[]): TableRow {
  return { type: 'tableRow', children: children || [] };
}

/**
 * 表中单元格定义
 * @param children
 * @returns
 */
export function tableCell(children: TableCell['children']): TableCell {
  return { type: 'tableCell', children: children || [] };
}

type TableCellNode = ArrayType<TableCell['children']>;

export type TableCellContent =
  | TableCellNode
  | string
  | boolean
  | number
  | undefined
  | null;

function isTableCellNode(content: TableCellContent): Boolean {
  return (
    content !== null &&
    typeof content !== 'number' &&
    typeof content !== 'string' &&
    typeof content !== 'boolean' &&
    typeof content !== 'undefined'
  );
}

function tableCellContentToNode(content: TableCellContent) {
  return isTableCellNode(content)
    ? (content as TableCellNode)
    : text(String(content));
}

export function table(
  columns: Column[],
  dataSource: Record<string, any>[]
): Table {
  return {
    type: 'table',
    align: columns.map((item) => item.align || 'center'),
    // 以每行区分
    children: [
      //表头的Children们
      /**
       * {
       *    type: 'tableCell',
       *   children: [{type: 'text', value: 'bar'}]
       *  }
       */
      columns.map((item) => tableCell([tableCellContentToNode(item.title)])),
      // 内容区
      ...dataSource.map((data) => {
        let children = columns.map((item) => {
          const { dataIndex, render } = item;
          let raw = data[dataIndex] || '';
          let value = render ? render(raw) : text(String(raw));
          return tableCell([tableCellContentToNode(value)]);
        });

        return children;
      }),
      // 增加表行
    ].map((item) => tableRow(item)),
  };
}
