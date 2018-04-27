interface AssertionArgs {
  given: string,
  should: string,
  expected: any,
  actual: any,
}
type Assert = (args: AssertionArgs) => void;
type Should = (desc?: string) => {assert: Assert};

declare module 'riteway' {
    export function describe(description: string, fn: (should: Should) => any | Promise<any>)
}