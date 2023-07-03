import { ReturnArray } from './interfaces';

/**
 * 扩展Children，使得单类型(T)或者数组类型(T[])的Children最终都变成数组 T[]
 * @param children
 * @returns any[]
 */
export function normalizeChildren<Children>(
  children?: Children
): ReturnArray<Children> {
  if (typeof children === 'undefined') {
    return [] as ReturnArray<Children>;
  }

  if (Array.isArray(children)) {
    return children as ReturnArray<Children>;
  }

  return [children] as ReturnArray<Children>;
}

// export function nodeWithChildren(type:string,children?:)

function nodeWithValue(type: string, value: string) {
  return { type, value };
}
