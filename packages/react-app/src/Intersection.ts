
// Intersection is a TypeScript utility type to compute the
// set-theoretic intersection of two types. NB in TypeScript, we have
// builtin sum types `A | B` which TypeScript calls "union types", and
// we have builtin set-theoretic union types `A & B` which TypeScript
// calls "intersection types", but TypeScript doesn't have a builtin
// set-theoretic intersection type, which we provide here.
export type Intersection<T, U> = Pick<T, SharedKeys<T, U>> & Pick<U, SharedKeys<T, U>>;

type OptionalKeys<T> = { [K in keyof T]: undefined extends T[K] ? K : never }[keyof T];
type RequiredKeys<T> = { [K in keyof T]: undefined extends T[K] ? never : K }[keyof T];
type SharedOptionalKeys<T, U> = Extract<OptionalKeys<T>, OptionalKeys<U>>;
type SharedRequiredKeys<T, U> = Extract<RequiredKeys<T>, RequiredKeys<U>>;
type SharedKeys<T, U> = SharedRequiredKeys<T, U> | SharedOptionalKeys<T, U>;

// ************************ Examples below here ************************
// type A = { id: string; name: string; };
// type B = { id: number; age: number; };
// type C = Intersection<A, B>;
// const c: C = {
//   id: 5, // fails, id is of type never because it' "string and number". But the id property is still required in C, so we can't construct a valid C
// };
// console.log(c);
// type D = { id: string | number; name: string; address: string; opt?: number | string; optInOne?: number; optSimple?: number };
// type E = { id: number | object; age: number; address: string; opt?: number | string; optInOne: number; optSimple?: number };
// type F = Intersection<D, E>;
// const f: F = {
//   id: 5, // works, `id: number` is in both
//   // id: "abc", // fails, `id: string` is only in D
//   // id: {}, // fails, `id: object` is only in E
//   address: "abc", // works, `address: string` is in both
//   // name: "foo", // fails, name is only in D
//   // age: 5, // fails, age is only in E
//   opt: 5, // works, `opt: number` is in both
//   // opt: "abc", // works, `opt: string` is in both
//   // omitting opt works because opt is optional in both
//   // optInOne: 5, // cannot be provided because it's optional in D and required only in E
//   // optSimple: 5, // works, `optSimple?: number` is in both
//   // omitting optSimple works because opt is optional in both
// };
// console.log(f);