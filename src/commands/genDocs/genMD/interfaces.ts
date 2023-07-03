export type ArrayType<T extends any[]> = T extends Array<infer R> ? R : never;
