/**
 * A simple identity function to ensure that the given array contains all items from the given union type.
 */
export const enforceAllUnionItems =
  <Union>() =>
  <Arr extends Union[]>(
    arr: Arr & ([Union] extends [Arr[number]] ? unknown : "Not a proper array")
  ): Arr => {
    return arr;
  };

type ExampleUnion = "foo" | "bar" | "baz";

// These are all valid - the order doesn't matter
const goodArray1 = enforceAllUnionItems<ExampleUnion>()(["bar", "foo", "baz"]);
const goodArray2 = enforceAllUnionItems<ExampleUnion>()(["foo", "bar", "baz"]);

//@ts-expect-error - "qux" is not in the union type
const badArray1 = enforceAllUnionItems<ExampleUnion>()(["bar", "qux", "foo"]);

//@ts-expect-error - "baz" is missing in the array
const badArray2 = enforceAllUnionItems<ExampleUnion>()(["bar", "foo"]);
