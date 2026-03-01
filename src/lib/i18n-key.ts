type ReplaceUnderscoreWithHyphen<S extends string> =
  S extends `${infer Head}_${infer Tail}`
    ? `${Head}-${ReplaceUnderscoreWithHyphen<Tail>}`
    : S;

/**
 * Converts a snake_case enum value to a kebab-case i18n key with a given prefix.
 */
export const toI18nKey = <Prefix extends string, S extends string>(
  prefix: Prefix,
  value: S,
): `${Prefix}-${ReplaceUnderscoreWithHyphen<S>}` =>
  `${prefix}-${value.replace(/_/g, "-")}` as `${Prefix}-${ReplaceUnderscoreWithHyphen<S>}`;
