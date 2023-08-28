/**
 * Gets the type of a property as requierd
 * @example
 * type ExampleType = {
 *  name?: string;
 *  age?: number;
 * };
 *
 * PropAsRequired<ExampleType, 'name'> = string
 * PropAsRequired<ExampleType, 'age'> = number
 */
export type PropAsRequired<T, K extends keyof T> = (T & { [P in K]-?: T[P] })[K];
