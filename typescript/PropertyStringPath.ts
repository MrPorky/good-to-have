type Primitive = string | number | bigint | boolean | undefined | symbol;

export type PropertyStringPath<T extends Record<string, any>, Prefix extends string = ''> = {
  [K in keyof T]:
  K extends string ?
  T[K] extends Primitive | Array<any> ? `${string & Prefix}${string & K}` : `${string & Prefix}${string & K}` | PropertyStringPath<T[K], `${string & Prefix}${string & K}.`>
  : never;
}[keyof T] & string;


export type TypeFromPath<T, K extends string> =
  K extends keyof T ? T[K] :
  K extends `${infer K0}.${infer KR}` ?
  K0 extends keyof T ? TypeFromPath<T[K0], KR> : never
  : never

// Example: Get Property Value
declare function getPropertyValue<T extends Record<string, any>, Path extends PropertyStringPath<T>>(obj: T, path: Path): TypeFromPath<T, Path>
