// TODO: Can we get rid of the `any` type?

/**
 * An example map of functions.
 */
const fnMap = {
  fn1: (foo: string) => `${foo} entered`,
  fn2: (bar: number) => bar * 2,
  fn3: (baz: boolean) => !baz,
};
type FnMap = typeof fnMap;

/************************************************/
/* Case 1: Simple and straightforward approach. */
/************************************************/
/**
 * A simple and straightforward way to call a union of functions.
 */
const callUnionFnTypeErrored = <FnName extends keyof FnMap>(
  fnName: FnName,
  arg: Parameters<FnMap[FnName]>[0]
) => {
  //@ts-expect-error - Due to the way that TypeScript infers the type of the argument, we get a type error here.
  return fnMap[fnName](arg);
};

// Call of the function is valid, but return type is not correctly inferred.
// Return type is the union of the return types of the functions in the union.
// (in this case, `string | number | boolean`)
callUnionFnTypeErrored("fn1", "hello");
callUnionFnTypeErrored("fn2", 1);
callUnionFnTypeErrored("fn3", true);

// We can use `as` casting to solve the problem... but it feels like a hack.
const callUnionFnHacky = <FnName extends keyof FnMap>(
  fnName: FnName,
  arg: Parameters<FnMap[FnName]>[0]
) => {
  return fnMap[fnName](arg as never) as ReturnType<FnMap[FnName]>;
};
callUnionFnHacky("fn1", "hello");
callUnionFnHacky("fn2", 1);
callUnionFnHacky("fn3", true);

/****************************************/
/* Case 2: With some TypeScript tricks. */
/****************************************/
type UnionFnReturn<FnUnion extends (arg: any) => any, P> = FnUnion extends (
  arg: infer Param
) => infer R
  ? P extends Param
    ? R
    : never
  : never;
/**
 * A helper function that solves parameter type intersection problem.
 */
function callUnionFnHelper<FnUnion extends (arg: any) => any, P>(
  fn: FnUnion,
  arg: P
): UnionFnReturn<FnUnion, P> {
  return fn(arg);
}
const callUnionFnValid = <FnName extends keyof FnMap>(
  fnName: FnName,
  arg: Parameters<FnMap[FnName]>[0]
) => {
  // There is no type error here, unlike in Case 1.
  return callUnionFnHelper(fnMap[fnName], arg);
};

// Now, return type of all the calls are correctly inferred.
callUnionFnValid("fn1", "hello");
callUnionFnValid("fn2", 1);
callUnionFnValid("fn3", true);

/**************************************************************/
/* Case 3: With some TypeScript tricks - multiple parameters. */
/**************************************************************/
const fnMapMultiParam = {
  fn1: (foo: string, bar: number) => `${foo} entered ${bar}`,
  fn2: (baz: boolean, qux: string) => !baz && qux,
  fn3: (foo: number) => foo + 3,
};
type FnMapMultiParam = typeof fnMapMultiParam;

type UnionFnMultiParamReturn<
  FnUnion extends (...args: any[]) => any,
  P extends any[]
> = FnUnion extends (...args: infer Param) => infer R
  ? P extends Param
    ? R
    : never
  : never;
/**
 * A helper function that solves parameter type intersection problem.
 */
function callUnionFnMultiParamHelper<
  FnUnion extends (...args: any[]) => any,
  P extends any[]
>(fn: FnUnion, ...args: P): UnionFnMultiParamReturn<FnUnion, P> {
  return fn(...args);
}
const callUnionFnMultiParamValid = <FnName extends keyof FnMapMultiParam>(
  fnName: FnName,
  ...args: Parameters<FnMapMultiParam[FnName]>
) => {
  return callUnionFnMultiParamHelper(fnMapMultiParam[fnName], ...args);
};

// Everything is so good now.
callUnionFnMultiParamValid("fn1", "hello", 1);
callUnionFnMultiParamValid("fn2", true, "world");
callUnionFnMultiParamValid("fn3", 2);
