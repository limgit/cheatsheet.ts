/**
 * Use this error to ensure that all branches are handled type-safely.
 */
export class UnhandledValueError extends Error {
  constructor(value: never) {
    super(`Unhandled value found: ${value}. This MUST not happen in runtime.`);
    Object.setPrototypeOf(this, UnhandledValueError.prototype);
  }
}

type ExampleUnion = "foo" | "bar" | "baz";

const handleCases = (arg: ExampleUnion) => {
  if (arg === "foo") {
    return "foo-tested";
  }
  if (arg === "bar") {
    return "hello-tested";
  }

  //@ts-expect-error `baz` case is not handled.
  throw new UnhandledValueError(arg);
};
