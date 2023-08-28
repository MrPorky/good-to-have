/**
 * Convert type to have optional properties as requiered props
 * @example
 * type ExampleType = {
 *  name?: string;
 *  age?: number;
 * };
 *
 * WithRequired<Test, 'name'> = { name: string; age?: number; }
 * WithRequired<Test, 'age'> = { name?: string; age: number; }
 * WithRequired<Test, 'name' | 'age'> = { name: string; age: number; }
 */
export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };
