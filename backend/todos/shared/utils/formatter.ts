export interface Formatter<I, O> {
  ifNotNull: (input: I | null) => O | null;
  one: (input: I) => O;
  many: (input: I[]) => O[];
}

export const formatterOf = <I, O>(
  format: (input: I) => O
): Formatter<I, O> => ({
  ifNotNull: (input) => (input !== null ? format(input) : null),
  one: (input) => format(input),
  many: (input) => input.map(format)
});
