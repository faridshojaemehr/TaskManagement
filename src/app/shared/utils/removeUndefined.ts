export const removeUndefinedValuesFromObject = <T extends Record<string, any>>(
  obj: T
): T => {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([_, value]) => value !== undefined || value !== null
    )
  ) as T;
};
