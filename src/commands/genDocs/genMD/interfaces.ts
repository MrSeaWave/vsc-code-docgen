/**
 * 推断数组类型
 */
export type ArrayType<T extends any[]> = T extends Array<infer R> ? R : never;

/**
 * 返回数组
 */
export type ReturnArray<T> = T extends any[] ? T : T[];

/**
 * 返回类型为 数组的元类型 | 数组
 */
export type FlattenOrArray<T extends any[]> = ArrayType<T> | T;
